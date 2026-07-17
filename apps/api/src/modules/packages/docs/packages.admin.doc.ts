import { applyDecorators } from '@nestjs/common';
import { Doc, DocAuth, DocGuard, DocRequest, DocResponse } from '@common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';
import {
    CarePackageCreateRequestDto,
    CarePackageUpdateRequestDto,
    ProtectionPackageCreateRequestDto,
    ProtectionPackageUpdateRequestDto,
} from '../dtos/packages.dto';

export function PackagesAdminCreateCareDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Create a new care package' }),
        DocRequest({ bodyType: EnumDocRequestBodyType.json, dto: CarePackageCreateRequestDto }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('packages.create')
    );
}

export function PackagesAdminUpdateCareDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Update a care package' }),
        DocRequest({
            params: [{ name: 'id', description: 'Package ID', required: true, type: 'string' }],
            bodyType: EnumDocRequestBodyType.json,
            dto: CarePackageUpdateRequestDto,
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('packages.update')
    );
}

export function PackagesAdminDeleteCareDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Delete a care package' }),
        DocRequest({
            params: [{ name: 'id', description: 'Package ID', required: true, type: 'string' }],
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('packages.delete')
    );
}

export function PackagesAdminCreateProtectionDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Create a new protection package' }),
        DocRequest({ bodyType: EnumDocRequestBodyType.json, dto: ProtectionPackageCreateRequestDto }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('packages.create')
    );
}

export function PackagesAdminUpdateProtectionDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Update a protection package' }),
        DocRequest({
            params: [{ name: 'id', description: 'Package ID', required: true, type: 'string' }],
            bodyType: EnumDocRequestBodyType.json,
            dto: ProtectionPackageUpdateRequestDto,
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('packages.update')
    );
}

export function PackagesAdminDeleteProtectionDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Delete a protection package' }),
        DocRequest({
            params: [{ name: 'id', description: 'Package ID', required: true, type: 'string' }],
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('packages.delete')
    );
}
