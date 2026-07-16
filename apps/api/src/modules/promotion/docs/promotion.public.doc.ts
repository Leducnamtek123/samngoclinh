import {
    Doc,
    DocAuth,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { PromotionFreeTreeResponseDto } from '@modules/promotion/dtos/response/promotion.free-tree.response.dto';

export function PromotionPublicFreeTreeCampaignDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get public free tree campaign list',
        }),
        DocAuth({
            xApiKey: true,
        }),
        DocResponse('promotion.freeTreeCampaign', {
            dto: PromotionFreeTreeResponseDto,
        })
    );
}
