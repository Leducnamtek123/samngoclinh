import { Injectable } from '@nestjs/common';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ICultivationService } from '@modules/cultivation/interfaces/cultivation.service.interface';
import { CultivationRepository } from '@modules/cultivation/repositories/cultivation.repository';
import { CultivationTreeResponseDto } from '@modules/cultivation/dtos/response/cultivation.tree.response.dto';
import { CultivationGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.garden.response.dto';
import { CultivationBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.bed.response.dto';

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
}
