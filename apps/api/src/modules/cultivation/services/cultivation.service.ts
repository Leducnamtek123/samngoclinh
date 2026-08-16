import { Injectable, NotFoundException } from '@nestjs/common';
import { validateStateTransition } from '@common/domain/domain-state-machine';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { IResponsePagingReturn, IResponseReturn } from '@common/response/interfaces/response.interface';
import { ICultivationService } from '@modules/cultivation/interfaces/cultivation.service.interface';
import { CultivationRepository } from '@modules/cultivation/repositories/cultivation.repository';
import { CultivationTreeResponseDto } from '@modules/cultivation/dtos/response/cultivation.tree.response.dto';
import { CultivationGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.garden.response.dto';
import { CultivationBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.bed.response.dto';
import { CultivationPublicBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.public-bed.response.dto';
import { CultivationPublicBedDetailResponseDto } from '@modules/cultivation/dtos/response/cultivation.public-bed-detail.response.dto';
import { CultivationPublicGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.public-garden.response.dto';
import {
    CultivationPurchaseLineResponseDto,
    CultivationPurchaseResponseDto,
    CultivationPurchaseScopeResponseDto,
    CultivationPurchaseSplitResponseDto,
} from '@modules/cultivation/dtos/response/cultivation.public-purchase.response.dto';
import { CultivationCreateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-garden.request.dto';
import { CultivationCreateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-bed.request.dto';
import { CultivationCreateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-tree.request.dto';
import { CultivationCreateCareLogRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-care-log.request.dto';
import { CultivationCreateBookingRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-booking.request.dto';
import { CultivationUpdateBookingStatusRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-booking-status.request.dto';
import { CultivationUpdateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-garden.request.dto';
import { CultivationUpdateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-bed.request.dto';
import { CultivationUpdateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-tree.request.dto';
import { CultivationBed, CultivationBedLocation, CultivationCareLog, CultivationGarden, CultivationTree, GardenBooking, Prisma } from '@generated/prisma-client';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';
import {
    ICultivationBedDetail,
    ICultivationBedLocationsGenerateResult,
    ICultivationPurchaseTreeGroup,
    ICultivationTreeDetail,
} from '@modules/cultivation/interfaces/cultivation.interface';

const CultivationVatRate = 0.08;
const CultivationPaymentSplitThreshold = 500_000_000;

@Injectable()
export class CultivationService implements ICultivationService {
    constructor(
        private readonly cultivationRepository: CultivationRepository,
        private readonly configService: ConfigService
    ) {}

    async trees(userId: string): Promise<IResponseReturn<CultivationTreeResponseDto[]>> {
        const groups = await this.cultivationRepository.getTreeAgeGroups(userId);

        return {
            data: groups,
        };
    }

    async publicGardens(): Promise<IResponseReturn<CultivationPublicGardenResponseDto[]>> {
        const gardens = await this.cultivationRepository.listPublicGardens();

        return {
            data: gardens,
        };
    }

    async gardenPurchase(
        gardenCode: string
    ): Promise<IResponseReturn<CultivationPurchaseResponseDto>> {
        const { garden, beds, treeGroups, priceByAge } =
            await this.cultivationRepository.getGardenPurchaseData(gardenCode);
        if (!garden) {
            throw new NotFoundException('Garden not found');
        }

        const scopes: CultivationPurchaseScopeResponseDto[] = [
            this.buildPurchaseScope(
                'all',
                null,
                garden.name,
                this.groupPurchaseLines(treeGroups, priceByAge)
            ),
            ...beds.map(bed =>
                this.buildPurchaseScope(
                    bed.code,
                    bed.name,
                    garden.name,
                    this.groupPurchaseLines(
                        treeGroups.filter(group => group.bedCode === bed.code),
                        priceByAge
                    )
                )
            ),
        ];

        return {
            data: {
                garden: { code: garden.code, name: garden.name },
                scopes,
            },
        };
    }

    private groupPurchaseLines(
        groups: ICultivationPurchaseTreeGroup[],
        priceByAge: Record<number, number>
    ): CultivationPurchaseLineResponseDto[] {
        const byAge = new Map<number, number>();
        for (const group of groups) {
            byAge.set(group.ageYear, (byAge.get(group.ageYear) ?? 0) + group.quantity);
        }
        return [...byAge.entries()]
            .sort((a, b) => a[0] - b[0])
            .map(([ageYear, treeCount]) =>
                this.buildPurchaseLine(ageYear, treeCount, priceByAge)
            );
    }

    private buildPurchaseLine(
        ageYear: number,
        treeCount: number,
        priceByAge: Record<number, number>
    ): CultivationPurchaseLineResponseDto {
        const pricePerTree = priceByAge[ageYear] ?? 0;
        return {
            ageYear,
            treeCount,
            pricePerTree,
            lineTotal: pricePerTree * treeCount,
        };
    }

    private buildPurchaseScope(
        key: string,
        bedName: string | null,
        gardenName: string,
        lines: CultivationPurchaseLineResponseDto[]
    ): CultivationPurchaseScopeResponseDto {
        const treeCount = lines.reduce((sum, line) => sum + line.treeCount, 0);
        const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
        const vat = Math.round(subtotal * CultivationVatRate);
        return {
            key,
            bedName,
            gardenName,
            treeCount,
            lines,
            subtotal,
            vat,
            total: subtotal + vat,
            split: this.buildPurchaseSplit(lines),
        };
    }

    private buildPurchaseSplit(
        lines: CultivationPurchaseLineResponseDto[]
    ): CultivationPurchaseSplitResponseDto[] {
        const orders: CultivationPurchaseSplitResponseDto[] = [];
        let count = 0;
        let subtotal = 0;
        const flush = (): void => {
            if (count === 0) {
                return;
            }
            orders.push({
                index: orders.length + 1,
                treeCount: count,
                amount: subtotal + Math.round(subtotal * CultivationVatRate),
            });
            count = 0;
            subtotal = 0;
        };
        for (const line of lines) {
            for (let i = 0; i < line.treeCount; i++) {
                const nextSubtotal = subtotal + line.pricePerTree;
                const nextTotal =
                    nextSubtotal + Math.round(nextSubtotal * CultivationVatRate);
                if (count > 0 && nextTotal > CultivationPaymentSplitThreshold) {
                    flush();
                }
                subtotal += line.pricePerTree;
                count += 1;
            }
        }
        flush();
        return orders;
    }

    async publicBedsByAge(
        ageYear: number | null
    ): Promise<IResponseReturn<CultivationPublicBedResponseDto[]>> {
        const beds = await this.cultivationRepository.listPublicBedsByAge(ageYear);

        return {
            data: beds,
        };
    }

    async publicBedDetail(
        code: string
    ): Promise<IResponseReturn<CultivationPublicBedDetailResponseDto>> {
        const detail = await this.cultivationRepository.getPublicBedDetail(code);
        if (!detail) {
            throw new NotFoundException('Bed not found');
        }

        const webUrl = this.configService.get<string>('app.webUrl');
        const qrCode = await QRCode.toDataURL(`${webUrl}/vi/trace/${code}`);

        return {
            data: { ...detail, qrCode },
        };
    }

    async gardens(userId: string): Promise<IResponseReturn<CultivationGardenResponseDto>> {
        const summary = await this.cultivationRepository.getGardenSummary(userId);

        return {
            data: summary,
        };
    }

    async gardensPaginated(
        userId: string,
        isAdmin: boolean,
        pagination: IPaginationQueryOffsetParams<
            Prisma.CultivationGardenSelect,
            Prisma.CultivationGardenWhereInput
        >
    ): Promise<IResponsePagingReturn<CultivationGarden>> {
        return this.cultivationRepository.getGardensPaginated(userId, isAdmin, pagination);
    }

    async gardensList(userId: string, isAdmin?: boolean): Promise<IResponseReturn<CultivationGarden[]>> {
        const gardens = await this.cultivationRepository.getGardensList(userId, isAdmin);
        return {
            data: gardens,
        };
    }

    async beds(
        userId: string,
        isAdmin: boolean,
        pagination: IPaginationQueryOffsetParams<
            Prisma.CultivationBedSelect,
            Prisma.CultivationBedWhereInput
        >,
        status?: Record<string, IPaginationEqual>,
        gardenCode?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<CultivationBedResponseDto>> {
        return this.cultivationRepository.getBedsPaginated(
            userId,
            isAdmin,
            pagination,
            status,
            gardenCode
        );
    }

    async createGarden(userId: string, payload: CultivationCreateGardenRequestDto): Promise<IResponseReturn<CultivationGarden>> {
        const garden = await this.cultivationRepository.createGarden(userId, payload);
        return {
            data: garden,
        };
    }

    async createBed(userId: string, payload: CultivationCreateBedRequestDto): Promise<IResponseReturn<CultivationBed>> {
        const bed = await this.cultivationRepository.createBed(userId, payload);
        return {
            data: bed,
        };
    }

    async createTree(userId: string, payload: CultivationCreateTreeRequestDto): Promise<IResponseReturn<CultivationTree>> {
        const tree = await this.cultivationRepository.createTree(userId, payload);
        return {
            data: tree,
        };
    }

    async createCareLog(userId: string, payload: CultivationCreateCareLogRequestDto): Promise<IResponseReturn<CultivationCareLog>> {
        if (payload.bedCode) {
            const bed = await this.cultivationRepository.getBedByCodeAndOwner(payload.bedCode, userId);
            if (!bed) {
                throw new NotFoundException('Bed not found or you do not own it');
            }
        }

        if (payload.treeCode) {
            const tree = await this.cultivationRepository.getTreeByCodeAndOwner(payload.treeCode, userId);
            if (!tree) {
                throw new NotFoundException('Tree not found or you do not own it');
            }
        }

        const log = await this.cultivationRepository.createCareLog(payload);
        return {
            data: log,
        };
    }

    async listCareLogs(bedCode?: string, treeCode?: string): Promise<IResponseReturn<CultivationCareLog[]>> {
        const logs = await this.cultivationRepository.listCareLogs(bedCode, treeCode);
        return {
            data: logs,
        };
    }

    async createBooking(userId: string, payload: CultivationCreateBookingRequestDto): Promise<IResponseReturn<GardenBooking>> {
        const booking = await this.cultivationRepository.createBooking(userId, payload);
        return {
            data: booking,
        };
    }

    async listBookings(userId?: string): Promise<IResponseReturn<GardenBooking[]>> {
        const bookings = await this.cultivationRepository.listBookings(userId);
        return {
            data: bookings,
        };
    }

    async updateBookingStatus(id: string, payload: CultivationUpdateBookingStatusRequestDto): Promise<IResponseReturn<GardenBooking>> {
        const existing = await this.cultivationRepository.getBookingById(id);
        if (!existing) {
            throw new NotFoundException('Booking not found');
        }
        const updated = await this.cultivationRepository.updateBookingStatus(id, payload);
        return {
            data: updated,
        };
    }

    async updateGarden(id: string, payload: CultivationUpdateGardenRequestDto): Promise<IResponseReturn<CultivationGarden>> {
        const res = await this.cultivationRepository.updateGarden(id, payload);
        return { data: res };
    }

    async deleteGarden(id: string): Promise<IResponseReturn<void>> {
        await this.cultivationRepository.deleteGarden(id);
        return { data: undefined };
    }

    async updateBed(id: string, payload: CultivationUpdateBedRequestDto): Promise<IResponseReturn<CultivationBed>> {
        const res = await this.cultivationRepository.updateBed(id, payload);
        return { data: res };
    }

    async deleteBed(id: string): Promise<IResponseReturn<void>> {
        await this.cultivationRepository.deleteBed(id);
        return { data: undefined };
    }

    async updateTree(id: string, payload: CultivationUpdateTreeRequestDto): Promise<IResponseReturn<CultivationTree>> {
        if (payload.status) {
            const existing = await this.cultivationRepository.getTreeDetail(id, '', true);
            if (!existing) {
                throw new NotFoundException('Tree not found');
            }
            validateStateTransition('Tree', existing.status, payload.status);
            const res = await this.cultivationRepository.updateTreeWithConcurrencyCheck(
                id,
                existing.status,
                payload
            );
            return { data: res };
        }
        const res = await this.cultivationRepository.updateTree(id, payload);
        return { data: res };
    }

    async deleteTree(id: string): Promise<IResponseReturn<void>> {
        await this.cultivationRepository.deleteTree(id);
        return { data: undefined };
    }

    async gardenDetail(id: string, userId: string, isAdmin?: boolean): Promise<IResponseReturn<CultivationGarden>> {
        const garden = await this.cultivationRepository.getGardenDetail(id, userId, isAdmin);
        if (!garden) {
            throw new NotFoundException('Garden not found');
        }
        return { data: garden };
    }

    async bedDetail(id: string, userId: string, isAdmin?: boolean): Promise<IResponseReturn<ICultivationBedDetail>> {
        const bed = await this.cultivationRepository.getBedDetail(id, userId, isAdmin);
        if (!bed) {
            throw new NotFoundException('Bed not found');
        }
        return { data: bed };
    }

    async treeDetail(id: string, userId: string, isAdmin?: boolean): Promise<IResponseReturn<ICultivationTreeDetail>> {
        const tree = await this.cultivationRepository.getTreeDetail(id, userId, isAdmin);
        if (!tree) {
            throw new NotFoundException('Tree not found');
        }
        return { data: tree };
    }

    async getBedLocations(bedCode: string): Promise<IResponseReturn<CultivationBedLocation[]>> {
        const res = await this.cultivationRepository.getBedLocations(bedCode);
        return { data: res };
    }

    async generateBedLocations(bedCode: string, rows: number, cols: number): Promise<IResponseReturn<ICultivationBedLocationsGenerateResult>> {
        const res = await this.cultivationRepository.generateBedLocations(bedCode, rows, cols);
        return { data: res };
    }

    async updateBedLocation(id: string, status: string, treeCode?: string): Promise<IResponseReturn<CultivationBedLocation>> {
        const res = await this.cultivationRepository.updateBedLocation(id, status, treeCode);
        return { data: res };
    }

    async deleteBedLocation(id: string): Promise<IResponseReturn<void>> {
        await this.cultivationRepository.deleteBedLocation(id);
        return { data: undefined };
    }

    async listAllTreesAdmin(): Promise<IResponseReturn<CultivationTree[]>> {
        const res = await this.cultivationRepository.listAllTreesAdmin();
        return { data: res };
    }

    async listAllTreesAdminPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.CultivationTreeSelect,
            Prisma.CultivationTreeWhereInput
        >,
        status?: Record<string, IPaginationEqual>,
        health?: Record<string, IPaginationEqual>,
        ownerUserId?: Record<string, IPaginationEqual>,
        ageYear?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<CultivationTree>> {
        return this.cultivationRepository.listAllTreesAdminPaginated(pagination, status, health, ownerUserId, ageYear);
    }
}
