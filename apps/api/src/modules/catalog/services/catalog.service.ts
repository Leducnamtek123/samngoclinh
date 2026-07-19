import { IResponseReturn, IResponsePagingReturn } from '@common/response/interfaces/response.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
    ICatalogPlantItem,
    ICatalogShopItem,
} from '@modules/catalog/interfaces/catalog.interface';
import { CatalogRepository } from '@modules/catalog/repositories/catalog.repository';
import { CatalogPlant, CatalogProduct, Prisma } from '@generated/prisma-client';
import {
    CatalogPlantCreateDto,
    CatalogPlantUpdateDto,
    CatalogProductCreateDto,
    CatalogProductUpdateDto,
} from '../dtos/catalog.admin.dto';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';

@Injectable()
export class CatalogService {
    constructor(private readonly catalogRepository: CatalogRepository) {}

    async listPlants(): Promise<
        IResponseReturn<{ items: ICatalogPlantItem[] }>
    > {
        return {
            data: {
                items: await this.catalogRepository.listPlants(),
            },
        };
    }

    async listShopItems(): Promise<
        IResponseReturn<{ items: ICatalogShopItem[] }>
    > {
        return {
            data: {
                items: await this.catalogRepository.listShopItems(),
            },
        };
    }

    async listPlantsPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.CatalogPlantSelect,
            Prisma.CatalogPlantWhereInput
        >,
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<CatalogPlant>> {
        return this.catalogRepository.listPlantsPaginated(pagination, status);
    }

    async listShopItemsPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.CatalogProductSelect,
            Prisma.CatalogProductWhereInput
        >,
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<CatalogProduct>> {
        return this.catalogRepository.listShopItemsPaginated(pagination, status);
    }

    async createPlant(data: CatalogPlantCreateDto): Promise<IResponseReturn<CatalogPlant>> {
        const item = await this.catalogRepository.createPlant(data);
        return { data: item };
    }

    async updatePlant(id: string, data: CatalogPlantUpdateDto): Promise<IResponseReturn<CatalogPlant>> {
        const item = await this.catalogRepository.updatePlant(id, data);
        return { data: item };
    }

    async deletePlant(id: string): Promise<IResponseReturn<CatalogPlant>> {
        const item = await this.catalogRepository.deletePlant(id);
        return { data: item };
    }

    async createProduct(data: CatalogProductCreateDto): Promise<IResponseReturn<CatalogProduct>> {
        const item = await this.catalogRepository.createProduct(data);
        return { data: item };
    }

    async updateProduct(id: string, data: CatalogProductUpdateDto): Promise<IResponseReturn<CatalogProduct>> {
        const item = await this.catalogRepository.updateProduct(id, data);
        return { data: item };
    }

    async deleteProduct(id: string): Promise<IResponseReturn<CatalogProduct>> {
        const item = await this.catalogRepository.deleteProduct(id);
        return { data: item };
    }

    async getPlantDetail(id: string): Promise<IResponseReturn<CatalogPlant>> {
        const item = await this.catalogRepository.getPlantDetail(id);
        if (!item) {
            throw new NotFoundException('Plant not found');
        }
        return { data: item };
    }

    async getProductDetail(id: string): Promise<IResponseReturn<CatalogProduct>> {
        const item = await this.catalogRepository.getProductDetail(id);
        if (!item) {
            throw new NotFoundException('Product not found');
        }
        return { data: item };
    }
}
