import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MarketplaceRepository } from '@modules/marketplace/repositories/marketplace.repository';
import { IMarketplaceListingItem } from '@modules/marketplace/interfaces/marketplace.interface';
import { MarketplaceCreateListingRequestDto } from '@modules/marketplace/dtos/request/marketplace.create-listing.request.dto';
import { MarketplaceUpdateListingRequestDto } from '@modules/marketplace/dtos/request/marketplace.update-listing.request.dto';
import { MarketplaceListing } from '@generated/prisma-client';

@Injectable()
export class MarketplaceService {
    constructor(
        private readonly marketplaceRepository: MarketplaceRepository
    ) {}

    async listListings(): Promise<
        IResponseReturn<{ items: IMarketplaceListingItem[] }>
    > {
        return {
            data: {
                items: await this.marketplaceRepository.listListings(),
            },
        };
    }

    async createListing(
        userId: string,
        payload: MarketplaceCreateListingRequestDto
    ): Promise<IResponseReturn<MarketplaceListing>> {
        const listing = await this.marketplaceRepository.createListing(
            userId,
            payload
        );
        return {
            data: listing,
        };
    }

    async updateListing(
        id: string,
        userId: string,
        payload: MarketplaceUpdateListingRequestDto
    ): Promise<IResponseReturn<MarketplaceListing>> {
        const existing = await this.marketplaceRepository.getListingById(id);
        if (!existing) {
            throw new NotFoundException('Listing not found');
        }
        const updated = await this.marketplaceRepository.updateListing(
            id,
            userId,
            payload
        );
        return {
            data: updated,
        };
    }

    async deleteListing(
        id: string,
        userId: string
    ): Promise<IResponseReturn<{ success: boolean }>> {
        const existing = await this.marketplaceRepository.getListingById(id);
        if (!existing) {
            throw new NotFoundException('Listing not found');
        }
        await this.marketplaceRepository.deleteListing(id, userId);
        return {
            data: { success: true },
        };
    }
}
