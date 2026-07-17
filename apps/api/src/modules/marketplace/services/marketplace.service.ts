import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MarketplaceRepository } from '@modules/marketplace/repositories/marketplace.repository';
import { IMarketplaceListingItem } from '@modules/marketplace/interfaces/marketplace.interface';
import { MarketplaceCreateListingRequestDto } from '@modules/marketplace/dtos/request/marketplace.create-listing.request.dto';
import { MarketplaceUpdateListingRequestDto } from '@modules/marketplace/dtos/request/marketplace.update-listing.request.dto';
import { MarketplaceListing } from '@generated/prisma-client';
import { DatabaseService } from '@common/database/services/database.service';

@Injectable()
export class MarketplaceService {
    constructor(
        private readonly marketplaceRepository: MarketplaceRepository,
        private readonly databaseService: DatabaseService
    ) {}

    async listListings(): Promise<IResponseReturn<{ items: IMarketplaceListingItem[] }>> {
        return {
            data: {
                items: await this.marketplaceRepository.listListings(),
            },
        };
    }

    async createListing(userId: string, payload: MarketplaceCreateListingRequestDto): Promise<IResponseReturn<MarketplaceListing>> {
        const user = await this.databaseService.user.findUnique({
            where: { id: userId },
            include: { role: true },
        });

        const ownerType = user?.role?.type === 'provider' ? 'provider' : 'customer';

        if (ownerType === 'customer') {
            const metadata = (payload.metadata ?? {}) as Record<string, unknown>;
            const treeCode = metadata?.treeCode as string;
            if (!treeCode) {
                throw new BadRequestException('Tree code is required for customer consignment');
            }

            const tree = await this.databaseService.cultivationTree.findFirst({
                where: { code: treeCode, ownerUserId: userId, status: 'active' },
            });
            if (!tree) {
                throw new BadRequestException('You do not own this tree or it is inactive');
            }
        }

        const listing = await this.marketplaceRepository.createListing(userId, ownerType, payload);
        return {
            data: listing,
        };
    }

    async updateListing(id: string, userId: string, payload: MarketplaceUpdateListingRequestDto): Promise<IResponseReturn<MarketplaceListing>> {
        const existing = await this.marketplaceRepository.getListingById(id);
        if (!existing) {
            throw new NotFoundException('Listing not found');
        }
        const updated = await this.marketplaceRepository.updateListing(id, userId, payload);
        return {
            data: updated,
        };
    }

    async deleteListing(id: string, userId: string): Promise<IResponseReturn<{ success: boolean }>> {
        const existing = await this.marketplaceRepository.getListingById(id);
        if (!existing) {
            throw new NotFoundException('Listing not found');
        }
        await this.marketplaceRepository.deleteListing(id, userId);
        return {
            data: { success: true },
        };
    }

    async listAllListings(): Promise<IResponseReturn<{ items: MarketplaceListing[] }>> {
        const items = await this.marketplaceRepository.listAllListings();
        return {
            data: { items },
        };
    }

    async listUserListings(userId: string): Promise<IResponseReturn<{ items: MarketplaceListing[] }>> {
        const items = await this.marketplaceRepository.listUserListings(userId);
        return {
            data: { items },
        };
    }

    async adminUpdateStatus(id: string, status: string): Promise<IResponseReturn<MarketplaceListing>> {
        const existing = await this.marketplaceRepository.getListingById(id);
        if (!existing) {
            throw new NotFoundException('Listing not found');
        }
        const updated = await this.marketplaceRepository.updateStatus(id, status);
        return {
            data: updated,
        };
    }
}
