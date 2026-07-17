import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { CultivationCreateGardenRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-garden.request.dto';
import { CultivationCreateBedRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-bed.request.dto';
import { CultivationCreateTreeRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-tree.request.dto';
import { CultivationCreateCareLogRequestDto } from '@modules/cultivation/dtos/request/cultivation.create-care-log.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function CultivationProviderCreateGardenDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Create a new cultivation garden',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: CultivationCreateGardenRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.createGarden')
    );
}

export function CultivationProviderCreateBedDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Create a new cultivation bed inside a garden',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: CultivationCreateBedRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.createBed')
    );
}

export function CultivationProviderCreateTreeDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Record/Plant new trees in a garden bed',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: CultivationCreateTreeRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.createTree')
    );
}

export function CultivationProviderCreateCareLogDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Create a new care history log for a bed or tree',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: CultivationCreateCareLogRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.createCareLog')
    );
}

export function CultivationProviderUpdateGardenDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Update garden details' }),
        DocRequest({
            params: [{ name: 'id', description: 'Garden ID', required: true, type: 'string' }],
            bodyType: EnumDocRequestBodyType.json,
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('cultivation.updateGarden')
    );
}

export function CultivationProviderDeleteGardenDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Delete a garden' }),
        DocRequest({
            params: [{ name: 'id', description: 'Garden ID', required: true, type: 'string' }],
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('cultivation.deleteGarden')
    );
}

export function CultivationProviderUpdateBedDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Update bed details' }),
        DocRequest({
            params: [{ name: 'id', description: 'Bed ID', required: true, type: 'string' }],
            bodyType: EnumDocRequestBodyType.json,
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('cultivation.updateBed')
    );
}

export function CultivationProviderDeleteBedDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Delete a bed' }),
        DocRequest({
            params: [{ name: 'id', description: 'Bed ID', required: true, type: 'string' }],
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('cultivation.deleteBed')
    );
}

export function CultivationProviderUpdateTreeDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Update tree details' }),
        DocRequest({
            params: [{ name: 'id', description: 'Tree ID', required: true, type: 'string' }],
            bodyType: EnumDocRequestBodyType.json,
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('cultivation.updateTree')
    );
}

export function CultivationProviderDeleteTreeDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Delete a tree' }),
        DocRequest({
            params: [{ name: 'id', description: 'Tree ID', required: true, type: 'string' }],
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('cultivation.deleteTree')
    );
}
