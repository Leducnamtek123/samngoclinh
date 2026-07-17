import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IMarketplaceListingItem } from '@modules/marketplace/interfaces/marketplace.interface';
import { MarketplaceListing } from '@generated/prisma-client';
import { MarketplaceCreateListingRequestDto } from '@modules/marketplace/dtos/request/marketplace.create-listing.request.dto';
import { MarketplaceUpdateListingRequestDto } from '@modules/marketplace/dtos/request/marketplace.update-listing.request.dto';

@Injectable()
export class MarketplaceRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async listListings(): Promise<IMarketplaceListingItem[]> {
        const items = await this.databaseService.marketplaceListing.findMany({
            where: { status: 'active' },
            orderBy: [{ price: 'asc' }, { createdAt: 'desc' }],
            select: {
                id: true,
                code: true,
                title: true,
                price: true,
                quantity: true,
                ownerType: true,
            },
        });

        return items.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            ownerType: item.ownerType as IMarketplaceListingItem['ownerType'],
        }));
    }

    async getListingById(id: string): Promise<MarketplaceListing | null> {
        return this.databaseService.marketplaceListing.findUnique({
            where: { id },
        });
    }

    async createListing(userId: string, ownerType: string, payload: MarketplaceCreateListingRequestDto): Promise<MarketplaceListing> {
        const code = 'lst-' + Math.random().toString(36).substring(2, 11);
        return this.databaseService.marketplaceListing.create({
            data: {
                code,
                title: payload.title,
                category: payload.category,
                price: payload.price,
                quantity: payload.quantity,
                ownerType,
                ownerUserId: userId,
                status: 'pending_approval',
                publishedAt: new Date(),
                metadata: (payload.metadata ?? {}) as Prisma.InputJsonValue,
            },
        });
    }

    async updateListing(
        id: string,
        userId: string,
        payload: MarketplaceUpdateListingRequestDto
    ): Promise<MarketplaceListing> {
        return this.databaseService.marketplaceListing.update({
            where: { id, ownerUserId: userId },
            data: {
                title: payload.title,
                price: payload.price,
                quantity: payload.quantity,
                metadata: payload.metadata as Prisma.InputJsonValue,
            },
        });
    }

    async deleteListing(id: string, userId: string): Promise<boolean> {
        await this.databaseService.marketplaceListing.update({
            where: { id, ownerUserId: userId },
            data: {
                status: 'archived',
            },
        });
        return true;
    }

    async updateStatus(id: string, status: string): Promise<MarketplaceListing> {
        return this.databaseService.marketplaceListing.update({
            where: { id },
            data: { status },
        });
    }

    async listAllListings(): Promise<MarketplaceListing[]> {
        return this.databaseService.marketplaceListing.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async listUserListings(userId: string): Promise<MarketplaceListing[]> {
        return this.databaseService.marketplaceListing.findMany({
            where: { ownerUserId: userId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
