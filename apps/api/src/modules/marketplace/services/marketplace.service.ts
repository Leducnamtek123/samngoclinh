import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { Injectable } from '@nestjs/common';
import { MarketplaceRepository } from '@modules/marketplace/repositories/marketplace.repository';
import { IMarketplaceListingItem } from '@modules/marketplace/interfaces/marketplace.interface';

@Injectable()
export class MarketplaceService {
    constructor(private readonly marketplaceRepository: MarketplaceRepository) {}

    async listListings(): Promise<IResponseReturn<{ items: IMarketplaceListingItem[] }>> {
        return {
            data: {
                items: await this.marketplaceRepository.listListings(),
            },
        };
    }
}
