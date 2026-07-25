import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PromotionCampaign } from '@generated/prisma-client';
import { PromotionRepository } from '@modules/promotion/repositories/promotion.repository';
import { IPromotionFreeTreeItem } from '@modules/promotion/interfaces/promotion.interface';
import { PromotionAdminCreateRequestDto } from '@modules/promotion/dtos/request/promotion.admin-create.request.dto';
import { PromotionAdminUpdateRequestDto } from '@modules/promotion/dtos/request/promotion.admin-update.request.dto';

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

    async adminListCampaigns(): Promise<
        IResponseReturn<{ items: PromotionCampaign[] }>
    > {
        const items = await this.promotionRepository.listCampaigns();
        return { data: { items } };
    }

    async adminCreateCampaign(
        data: PromotionAdminCreateRequestDto
    ): Promise<IResponseReturn<PromotionCampaign>> {
        const item = await this.promotionRepository.createCampaign(data);
        return { data: item };
    }

    async adminUpdateCampaign(
        id: string,
        data: PromotionAdminUpdateRequestDto
    ): Promise<IResponseReturn<PromotionCampaign>> {
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
