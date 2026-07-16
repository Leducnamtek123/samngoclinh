import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { Injectable } from '@nestjs/common';
import { PromotionRepository } from '@modules/promotion/repositories/promotion.repository';
import { IPromotionFreeTreeItem } from '@modules/promotion/interfaces/promotion.interface';

@Injectable()
export class PromotionService {
    constructor(private readonly promotionRepository: PromotionRepository) {}

    async freeTreeCampaign(): Promise<IResponseReturn<{ items: IPromotionFreeTreeItem[]; note: string }>> {
        const payload = await this.promotionRepository.freeTreeCampaign();

        return {
            data: payload,
        };
    }
}
