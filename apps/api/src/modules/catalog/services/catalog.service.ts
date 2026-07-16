import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { Injectable } from '@nestjs/common';
import {
    ICatalogPlantItem,
    ICatalogShopItem,
} from '@modules/catalog/interfaces/catalog.interface';
import { CatalogRepository } from '@modules/catalog/repositories/catalog.repository';

@Injectable()
export class CatalogService {
    constructor(private readonly catalogRepository: CatalogRepository) {}

    async listPlants(): Promise<IResponseReturn<{ items: ICatalogPlantItem[] }>> {
        return {
            data: {
                items: await this.catalogRepository.listPlants(),
            },
        };
    }

    async listShopItems(): Promise<IResponseReturn<{ items: ICatalogShopItem[] }>> {
        return {
            data: {
                items: await this.catalogRepository.listShopItems(),
            },
        };
    }
}
