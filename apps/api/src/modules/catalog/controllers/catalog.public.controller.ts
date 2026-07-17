import { Controller, Get, Param, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { CatalogService } from '@modules/catalog/services/catalog.service';
import {
    CatalogPublicGetPlantDoc,
    CatalogPublicGetProductDoc,
    CatalogPublicListPlantsDoc,
    CatalogPublicListShopItemsDoc,
} from '@modules/catalog/docs/catalog.public.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { CatalogPlantResponseDto } from '@modules/catalog/dtos/response/catalog.plant.response.dto';
import { CatalogProductResponseDto } from '@modules/catalog/dtos/response/catalog.product.response.dto';
import { CatalogPlant, CatalogProduct } from '@generated/prisma-client';

@ApiTags('modules.public.catalog')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/catalog',
})
export class CatalogPublicController {
    constructor(private readonly catalogService: CatalogService) {}

    @CatalogPublicListPlantsDoc()
    @Response('catalog.listPlants')
    @ApiKeyProtected()
    @Get('/plants')
    async listPlants(): Promise<
        IResponseReturn<{ items: CatalogPlantResponseDto[] }>
    > {
        return this.catalogService.listPlants();
    }

    @CatalogPublicListShopItemsDoc()
    @Response('catalog.listShopItems')
    @ApiKeyProtected()
    @Get('/shop-items')
    async listShopItems(): Promise<
        IResponseReturn<{ items: CatalogProductResponseDto[] }>
    > {
        return this.catalogService.listShopItems();
    }

    @CatalogPublicGetPlantDoc()
    @Response('catalog.listPlants')
    @ApiKeyProtected()
    @Get('/plants/:id')
    async getPlantDetail(
        @Param('id') id: string
    ): Promise<IResponseReturn<CatalogPlant>> {
        return this.catalogService.getPlantDetail(id);
    }

    @CatalogPublicGetProductDoc()
    @Response('catalog.listShopItems')
    @ApiKeyProtected()
    @Get('/shop-items/:id')
    async getProductDetail(
        @Param('id') id: string
    ): Promise<IResponseReturn<CatalogProduct>> {
        return this.catalogService.getProductDetail(id);
    }
}
