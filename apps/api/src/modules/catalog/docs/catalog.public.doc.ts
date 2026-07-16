import {
    Doc,
    DocAuth,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { CatalogPlantResponseDto } from '@modules/catalog/dtos/response/catalog.plant.response.dto';
import { CatalogProductResponseDto } from '@modules/catalog/dtos/response/catalog.product.response.dto';

export function CatalogPublicListPlantsDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get public catalog list of plants',
        }),
        DocAuth({
            xApiKey: true,
        }),
        DocResponse('catalog.listPlants', {
            dto: CatalogPlantResponseDto,
        })
    );
}

export function CatalogPublicListShopItemsDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get public catalog list of shop products',
        }),
        DocAuth({
            xApiKey: true,
        }),
        DocResponse('catalog.listShopItems', {
            dto: CatalogProductResponseDto,
        })
    );
}
