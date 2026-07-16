import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { IMarketplaceListingItem } from '@modules/marketplace/interfaces/marketplace.interface';

@Injectable()
export class MarketplaceRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async listListings(): Promise<IMarketplaceListingItem[]> {
        const items = await this.databaseService.marketplaceListing.findMany({
            where: { status: 'active' },
            orderBy: [{ price: 'asc' }, { createdAt: 'desc' }],
            select: {
                code: true,
                title: true,
                price: true,
                quantity: true,
                ownerType: true,
            },
        });

        return items.map(item => ({
            id: item.code,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            ownerType: item.ownerType as IMarketplaceListingItem['ownerType'],
        }));
    }
}
