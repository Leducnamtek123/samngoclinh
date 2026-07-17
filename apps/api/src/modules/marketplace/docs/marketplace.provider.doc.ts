import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { MarketplaceCreateListingRequestDto } from '@modules/marketplace/dtos/request/marketplace.create-listing.request.dto';
import { MarketplaceUpdateListingRequestDto } from '@modules/marketplace/dtos/request/marketplace.update-listing.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function MarketplaceProviderCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Create a new marketplace listing',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: MarketplaceCreateListingRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('marketplace.create')
    );
}

export function MarketplaceProviderUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Update an existing marketplace listing',
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
            dto: MarketplaceUpdateListingRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('marketplace.update')
    );
}

export function MarketplaceProviderDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Archive/Delete a marketplace listing',
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
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('marketplace.delete')
    );
}

export function MarketplaceProviderListMeDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List active and pending listings created by the logged in user',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('marketplace.list')
    );
}

