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
import { CultivationBed, CultivationCareLog, CultivationGarden, CultivationTree, GardenBooking } from '@generated/prisma-client';

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
}
