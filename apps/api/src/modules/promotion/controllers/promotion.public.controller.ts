import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { PromotionService } from '@modules/promotion/services/promotion.service';
import { PromotionPublicFreeTreeCampaignDoc } from '@modules/promotion/docs/promotion.public.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { PromotionFreeTreeResponseDto } from '@modules/promotion/dtos/response/promotion.free-tree.response.dto';

@ApiTags('modules.public.promotion')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/promotion',
})
export class PromotionPublicController {
    constructor(private readonly promotionService: PromotionService) {}

    @PromotionPublicFreeTreeCampaignDoc()
    @Response('promotion.freeTreeCampaign')
    @ApiKeyProtected()
    @Get('/free-tree')
    async freeTreeCampaign(): Promise<IResponseReturn<PromotionFreeTreeResponseDto>> {
        return this.promotionService.freeTreeCampaign();
    }
}
