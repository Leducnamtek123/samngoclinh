import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { MarketplaceService } from '@modules/marketplace/services/marketplace.service';
import { MarketplacePublicListListingsDoc } from '@modules/marketplace/docs/marketplace.public.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { MarketplaceListingResponseDto } from '@modules/marketplace/dtos/response/marketplace.listing.response.dto';

@ApiTags('modules.public.marketplace')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/marketplace',
})
export class MarketplacePublicController {
    constructor(private readonly marketplaceService: MarketplaceService) {}

    @MarketplacePublicListListingsDoc()
    @Response('marketplace.listListings')
    @ApiKeyProtected()
    @Get('/listings')
    async listListings(): Promise<IResponseReturn<{ items: MarketplaceListingResponseDto[] }>> {
        return this.marketplaceService.listListings();
    }
}
