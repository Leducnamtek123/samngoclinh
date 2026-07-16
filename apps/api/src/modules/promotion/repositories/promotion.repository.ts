import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { IPromotionFreeTreeItem } from '@modules/promotion/interfaces/promotion.interface';

@Injectable()
export class PromotionRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async freeTreeCampaign(): Promise<{
        note: string;
        items: IPromotionFreeTreeItem[];
    }> {
        const campaign = await this.databaseService.promotionCampaign.findFirst({
            where: { status: 'active' },
            orderBy: [{ remainingSlots: 'desc' }, { createdAt: 'desc' }],
        });

        if (!campaign) {
            return {
                note: 'Không có ưu đãi đang mở.',
                items: [],
            };
        }

        const plant = campaign.plantCode
            ? await this.databaseService.catalogPlant.findUnique({
                  where: { code: campaign.plantCode },
                  select: { name: true, price: true },
              })
            : null;

        return {
            note: campaign.note ?? campaign.description,
            items: [
                {
                    id: campaign.code,
                    plantName: plant?.name ?? campaign.title,
                    price: plant?.price ?? 0,
                    eligible:
                        campaign.requiredVerified || campaign.requiredDeposit
                            ? false
                            : true,
                    remainingSlots: campaign.remainingSlots,
                },
            ],
        };
    }
}
