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
