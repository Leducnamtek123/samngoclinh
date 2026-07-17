import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import {
    ICatalogPlantItem,
    ICatalogShopItem,
} from '@modules/catalog/interfaces/catalog.interface';

import { CatalogPlant, CatalogProduct } from '@generated/prisma-client';
import {
    CatalogPlantCreateDto,
    CatalogPlantUpdateDto,
    CatalogProductCreateDto,
    CatalogProductUpdateDto,
} from '../dtos/catalog.admin.dto';

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

    async createPlant(data: CatalogPlantCreateDto): Promise<CatalogPlant> {
        return this.databaseService.catalogPlant.create({
            data: {
                code: data.code,
                name: data.name,
                ageYear: data.ageYear,
                price: data.price,
                stock: data.stock,
                status: data.status,
                images: data.images ?? [],
                description: data.description ?? null,
            },
        });
    }

    async updatePlant(id: string, data: CatalogPlantUpdateDto): Promise<CatalogPlant> {
        return this.databaseService.catalogPlant.update({
            where: { id },
            data: {
                name: data.name ?? undefined,
                ageYear: data.ageYear ?? undefined,
                price: data.price ?? undefined,
                stock: data.stock ?? undefined,
                status: data.status ?? undefined,
                images: data.images ?? undefined,
                description: data.description ?? undefined,
            },
        });
    }

    async deletePlant(id: string): Promise<CatalogPlant> {
        return this.databaseService.catalogPlant.delete({ where: { id } });
    }

    async createProduct(data: CatalogProductCreateDto): Promise<CatalogProduct> {
        return this.databaseService.catalogProduct.create({
            data: {
                code: data.code,
                name: data.name,
                category: data.category,
                unit: data.unit,
                price: data.price,
                stock: data.stock,
                status: data.status,
                featured: data.featured ?? false,
                images: data.images ?? [],
                description: data.description ?? null,
            },
        });
    }

    async updateProduct(id: string, data: CatalogProductUpdateDto): Promise<CatalogProduct> {
        return this.databaseService.catalogProduct.update({
            where: { id },
            data: {
                name: data.name ?? undefined,
                category: data.category ?? undefined,
                unit: data.unit ?? undefined,
                price: data.price ?? undefined,
                stock: data.stock ?? undefined,
                status: data.status ?? undefined,
                featured: data.featured ?? undefined,
                images: data.images ?? undefined,
                description: data.description ?? undefined,
            },
        });
    }

    async deleteProduct(id: string): Promise<CatalogProduct> {
        return this.databaseService.catalogProduct.delete({ where: { id } });
    }

    async getPlantDetail(id: string): Promise<CatalogPlant | null> {
        return this.databaseService.catalogPlant.findUnique({ where: { id } });
    }

    async getProductDetail(id: string): Promise<CatalogProduct | null> {
        return this.databaseService.catalogProduct.findUnique({ where: { id } });
    }
}
