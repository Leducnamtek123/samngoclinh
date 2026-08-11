import { Controller, Get, Param, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, ResponsePaging } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { CatalogService } from '@modules/catalog/services/catalog.service';
import {
    CatalogPublicGetPlantDoc,
    CatalogPublicGetProductDoc,
    CatalogPublicListPlantsDoc,
    CatalogPublicListShopItemsDoc,
} from '@modules/catalog/docs/catalog.public.doc';
import { IResponsePagingReturn, IResponseReturn } from '@common/response/interfaces/response.interface';
import { CatalogPlant, CatalogProduct, Prisma } from '@generated/prisma-client';
import { PaginationOffsetQuery, PaginationQueryFilterEqualString } from '@common/pagination/decorators/pagination.decorator';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';

@ApiTags('modules.public.catalog')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/catalog',
})
export class CatalogPublicController {
    constructor(private readonly catalogService: CatalogService) {}

    @CatalogPublicListPlantsDoc()
    @ResponsePaging('catalog.listPlants')
    @ApiKeyProtected()
    @Get('/plants')
    async listPlants(
        @PaginationOffsetQuery({
            availableSearch: ['name', 'code'],
            availableOrderBy: ['createdAt', 'name', 'price'],
            defaultPerPage: 10,
        })
        pagination: IPaginationQueryOffsetParams<
            Prisma.CatalogPlantSelect,
            Prisma.CatalogPlantWhereInput
        >,
        @PaginationQueryFilterEqualString('status')
        status?: Record<string, IPaginationEqual>,
        @PaginationQueryFilterEqualString('ageYear')
        ageYear?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<CatalogPlant>> {
        return this.catalogService.listPlantsPaginated(pagination, status, ageYear);
    }

    @CatalogPublicListShopItemsDoc()
    @ResponsePaging('catalog.listShopItems')
    @ApiKeyProtected()
    @Get('/shop-items')
    async listShopItems(
        @PaginationOffsetQuery({
            availableSearch: ['name', 'code'],
            availableOrderBy: ['createdAt', 'name', 'price'],
            defaultPerPage: 10,
        })
        pagination: IPaginationQueryOffsetParams<
            Prisma.CatalogProductSelect,
            Prisma.CatalogProductWhereInput
        >,
        @PaginationQueryFilterEqualString('status')
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<CatalogProduct>> {
        return this.catalogService.listShopItemsPaginated(pagination, status);
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
