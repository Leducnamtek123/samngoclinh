import { applyDecorators } from '@nestjs/common';
import { Doc, DocAuth, DocGuard, DocRequest, DocResponse } from '@common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';
import { PackageSubscribeRequestDto } from '../dtos/packages.dto';

export function PackagesUserListCareDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'List all active care packages' }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('packages.list')
    );
}

export function PackagesUserListProtectionDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'List all active protection packages' }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('packages.list')
    );
}

export function PackagesUserSubscribeDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Subscribe a plant to a care or protection package' }),
        DocRequest({ bodyType: EnumDocRequestBodyType.json, dto: PackageSubscribeRequestDto }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('packages.subscribe')
    );
}
