import { applyDecorators } from '@nestjs/common';
import { Doc, DocAuth, DocGuard, DocRequest, DocResponse } from '@common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';
import {
    CatalogPlantCreateDto,
    CatalogPlantUpdateDto,
    CatalogProductCreateDto,
    CatalogProductUpdateDto,
} from '../dtos/catalog.admin.dto';

export function CatalogAdminCreatePlantDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Create a new plant catalog entry' }),
        DocRequest({ bodyType: EnumDocRequestBodyType.json, dto: CatalogPlantCreateDto }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('catalog.create')
    );
}

export function CatalogAdminUpdatePlantDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Update a plant catalog entry' }),
        DocRequest({
            params: [{ name: 'id', description: 'Plant ID', required: true, type: 'string' }],
            bodyType: EnumDocRequestBodyType.json,
            dto: CatalogPlantUpdateDto,
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('catalog.update')
    );
}

export function CatalogAdminDeletePlantDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Delete a plant catalog entry' }),
        DocRequest({
            params: [{ name: 'id', description: 'Plant ID', required: true, type: 'string' }],
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('catalog.delete')
    );
}

export function CatalogAdminCreateProductDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Create a new shop product' }),
        DocRequest({ bodyType: EnumDocRequestBodyType.json, dto: CatalogProductCreateDto }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('catalog.create')
    );
}

export function CatalogAdminUpdateProductDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Update a shop product' }),
        DocRequest({
            params: [{ name: 'id', description: 'Product ID', required: true, type: 'string' }],
            bodyType: EnumDocRequestBodyType.json,
            dto: CatalogProductUpdateDto,
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('catalog.update')
    );
}

export function CatalogAdminDeleteProductDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Delete a shop product' }),
        DocRequest({
            params: [{ name: 'id', description: 'Product ID', required: true, type: 'string' }],
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('catalog.delete')
    );
}
