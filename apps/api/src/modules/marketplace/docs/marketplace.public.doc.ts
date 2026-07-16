import {
    Doc,
    DocAuth,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { MarketplaceListingResponseDto } from '@modules/marketplace/dtos/response/marketplace.listing.response.dto';

export function MarketplacePublicListListingsDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get public marketplace listings',
        }),
        DocAuth({
            xApiKey: true,
        }),
        DocResponse('marketplace.listListings', {
            dto: MarketplaceListingResponseDto,
        })
    );
}
