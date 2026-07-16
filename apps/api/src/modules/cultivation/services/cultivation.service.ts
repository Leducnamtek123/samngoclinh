import { Injectable } from '@nestjs/common';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ICultivationService } from '@modules/cultivation/interfaces/cultivation.service.interface';
import { CultivationRepository } from '@modules/cultivation/repositories/cultivation.repository';
import { CultivationTreeResponseDto } from '@modules/cultivation/dtos/response/cultivation.tree.response.dto';
import { CultivationGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.garden.response.dto';
import { CultivationBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.bed.response.dto';
import { CultivationCreateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-garden.request.dto';
import { CultivationCreateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-bed.request.dto';
import { CultivationCreateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-tree.request.dto';
import {
    CultivationBed,
    CultivationGarden,
    CultivationTree,
} from '@generated/prisma-client';

@Injectable()
export class CultivationService implements ICultivationService {
    constructor(
        private readonly cultivationRepository: CultivationRepository
    ) {}

    async trees(
        userId: string
    ): Promise<IResponseReturn<CultivationTreeResponseDto[]>> {
        const groups =
            await this.cultivationRepository.getTreeAgeGroups(userId);

        return {
            data: groups,
        };
    }

    async gardens(
        userId: string
    ): Promise<IResponseReturn<CultivationGardenResponseDto>> {
        const summary =
            await this.cultivationRepository.getGardenSummary(userId);

        return {
            data: summary,
        };
    }

    async beds(
        userId: string
    ): Promise<IResponseReturn<{ items: CultivationBedResponseDto[] }>> {
        const items = await this.cultivationRepository.getBeds(userId);

        return {
            data: {
                items,
            },
        };
    }

    async createGarden(
        userId: string,
        payload: CultivationCreateGardenRequestDto
    ): Promise<IResponseReturn<CultivationGarden>> {
        const garden = await this.cultivationRepository.createGarden(
            userId,
            payload
        );
        return {
            data: garden,
        };
    }

    async createBed(
        userId: string,
        payload: CultivationCreateBedRequestDto
    ): Promise<IResponseReturn<CultivationBed>> {
        const bed = await this.cultivationRepository.createBed(userId, payload);
        return {
            data: bed,
        };
    }

    async createTree(
        userId: string,
        payload: CultivationCreateTreeRequestDto
    ): Promise<IResponseReturn<CultivationTree>> {
        const tree = await this.cultivationRepository.createTree(
            userId,
            payload
        );
        return {
            data: tree,
        };
    }
}
