import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { MarketplaceAdminUpdateStatusRequestDto } from '@modules/marketplace/dtos/request/marketplace.admin-update-status.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function MarketplaceAdminListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List all marketplace listings (Admin)',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('marketplace.list')
    );
}

export function MarketplaceAdminUpdateStatusDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Moderate (Approve/Reject) a marketplace listing',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Listing ID',
                    required: true,
                    type: 'string',
                },
            ],
            bodyType: EnumDocRequestBodyType.json,
            dto: MarketplaceAdminUpdateStatusRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('marketplace.update')
    );
}
