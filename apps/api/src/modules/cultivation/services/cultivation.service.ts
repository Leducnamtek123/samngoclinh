import { Injectable, NotFoundException } from '@nestjs/common';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ICultivationService } from '@modules/cultivation/interfaces/cultivation.service.interface';
import { CultivationRepository } from '@modules/cultivation/repositories/cultivation.repository';
import { CultivationTreeResponseDto } from '@modules/cultivation/dtos/response/cultivation.tree.response.dto';
import { CultivationGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.garden.response.dto';
import { CultivationBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.bed.response.dto';
import { CultivationCreateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-garden.request.dto';
import { CultivationCreateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-bed.request.dto';
import { CultivationCreateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-tree.request.dto';
import { CultivationCreateCareLogRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-care-log.request.dto';
import { CultivationCreateBookingRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-booking.request.dto';
import { CultivationUpdateBookingStatusRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-booking-status.request.dto';
import { CultivationUpdateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-garden.request.dto';
import { CultivationUpdateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-bed.request.dto';
import { CultivationUpdateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.update-tree.request.dto';
import { CultivationBed, CultivationBedLocation, CultivationCareLog, CultivationGarden, CultivationTree, GardenBooking } from '@generated/prisma-client';

@Injectable()
export class CultivationService implements ICultivationService {
    constructor(private readonly cultivationRepository: CultivationRepository) {}

    async trees(userId: string): Promise<IResponseReturn<CultivationTreeResponseDto[]>> {
        const groups = await this.cultivationRepository.getTreeAgeGroups(userId);

        return {
            data: groups,
        };
    }

    async gardens(userId: string): Promise<IResponseReturn<CultivationGardenResponseDto>> {
        const summary = await this.cultivationRepository.getGardenSummary(userId);

        return {
            data: summary,
        };
    }

    async gardensList(userId: string): Promise<IResponseReturn<CultivationGarden[]>> {
        const gardens = await this.cultivationRepository.getGardensList(userId);
        return {
            data: gardens,
        };
    }

    async beds(userId: string): Promise<IResponseReturn<{ items: CultivationBedResponseDto[] }>> {
        const items = await this.cultivationRepository.getBeds(userId);

        return {
            data: {
                items,
            },
        };
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
        const res = await this.cultivationRepository.updateGarden(id, payload.name, payload.metadata);
        return { data: res };
    }

    async deleteGarden(id: string): Promise<IResponseReturn<void>> {
        await this.cultivationRepository.deleteGarden(id);
        return { data: undefined };
    }

    async updateBed(id: string, payload: CultivationUpdateBedRequestDto): Promise<IResponseReturn<CultivationBed>> {
        const res = await this.cultivationRepository.updateBed(id, payload.name, payload.ageYear, payload.treeCount, payload.metadata);
        return { data: res };
    }

    async deleteBed(id: string): Promise<IResponseReturn<void>> {
        await this.cultivationRepository.deleteBed(id);
        return { data: undefined };
    }

    async updateTree(id: string, payload: CultivationUpdateTreeRequestDto): Promise<IResponseReturn<CultivationTree>> {
        const res = await this.cultivationRepository.updateTree(id, payload.name, payload.ageYear, payload.quantity, payload.status, payload.metadata);
        return { data: res };
    }

    async deleteTree(id: string): Promise<IResponseReturn<void>> {
        await this.cultivationRepository.deleteTree(id);
        return { data: undefined };
    }

    async gardenDetail(id: string, userId: string): Promise<IResponseReturn<CultivationGarden>> {
        const garden = await this.cultivationRepository.getGardenDetail(id, userId);
        if (!garden) {
            throw new NotFoundException('Garden not found');
        }
        return { data: garden };
    }

    async bedDetail(id: string, userId: string): Promise<IResponseReturn<any>> {
        const bed = await this.cultivationRepository.getBedDetail(id, userId);
        if (!bed) {
            throw new NotFoundException('Bed not found');
        }
        return { data: bed };
    }

    async treeDetail(id: string, userId: string): Promise<IResponseReturn<any>> {
        const tree = await this.cultivationRepository.getTreeDetail(id, userId);
        if (!tree) {
            throw new NotFoundException('Tree not found');
        }
        return { data: tree };
    }

    async getBedLocations(bedCode: string): Promise<IResponseReturn<CultivationBedLocation[]>> {
        const res = await this.cultivationRepository.getBedLocations(bedCode);
        return { data: res };
    }

    async generateBedLocations(bedCode: string, rows: number, cols: number): Promise<IResponseReturn<any>> {
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
}
