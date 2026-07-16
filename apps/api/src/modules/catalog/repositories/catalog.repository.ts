import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import {
    ICatalogPlantItem,
    ICatalogShopItem,
} from '@modules/catalog/interfaces/catalog.interface';

@Injectable()
export class CatalogRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async listPlants(): Promise<ICatalogPlantItem[]> {
        const items = await this.databaseService.catalogPlant.findMany({
            orderBy: [{ ageYear: 'asc' }, { price: 'asc' }],
            select: {
                code: true,
                name: true,
                ageYear: true,
                price: true,
                stock: true,
                status: true,
            },
        });

        return items.map(item => ({
            id: item.code,
            name: item.name,
            ageYear: item.ageYear,
            price: item.price,
            stock: item.stock,
            status: item.status as ICatalogPlantItem['status'],
        }));
    }

    async listShopItems(): Promise<ICatalogShopItem[]> {
        const items = await this.databaseService.catalogProduct.findMany({
            orderBy: [{ featured: 'desc' }, { price: 'asc' }],
            select: {
                code: true,
                name: true,
                price: true,
                unit: true,
                category: true,
            },
        });

        return items.map(item => ({
            id: item.code,
            name: item.name,
            price: item.price,
            unit: item.unit,
            category: item.category,
        }));
    }
}
