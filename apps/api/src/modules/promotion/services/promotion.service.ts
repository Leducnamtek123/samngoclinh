import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PromotionRepository } from '@modules/promotion/repositories/promotion.repository';
import { IPromotionFreeTreeItem } from '@modules/promotion/interfaces/promotion.interface';

@Injectable()
export class PromotionService {
    constructor(private readonly promotionRepository: PromotionRepository) {}

    async freeTreeCampaign(): Promise<
        IResponseReturn<{ items: IPromotionFreeTreeItem[]; note: string }>
    > {
        const payload = await this.promotionRepository.freeTreeCampaign();

        return {
            data: payload,
        };
    }

    async adminListCampaigns(): Promise<IResponseReturn<{ items: any[] }>> {
        const items = await this.promotionRepository.listCampaigns();
        return { data: { items } };
    }

    async adminCreateCampaign(data: any): Promise<IResponseReturn<any>> {
        const item = await this.promotionRepository.createCampaign(data);
        return { data: item };
    }

    async adminUpdateCampaign(id: string, data: any): Promise<IResponseReturn<any>> {
        const item = await this.promotionRepository.updateCampaign(id, data);
        if (!item) {
            throw new NotFoundException('Campaign not found');
        }
        return { data: item };
    }

    async adminDeleteCampaign(id: string): Promise<IResponseReturn<void>> {
        await this.promotionRepository.deleteCampaign(id);
        return { data: undefined };
    }
}
