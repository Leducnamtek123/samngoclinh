import { Body, Controller, Delete, Param, Post, Put, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { EnumRoleType, MarketplaceListing } from '@generated/prisma-client';
import { MarketplaceService } from '@modules/marketplace/services/marketplace.service';
import { MarketplaceCreateListingRequestDto } from '@modules/marketplace/dtos/request/marketplace.create-listing.request.dto';
import { MarketplaceUpdateListingRequestDto } from '@modules/marketplace/dtos/request/marketplace.update-listing.request.dto';
import {
    MarketplaceProviderCreateDoc,
    MarketplaceProviderDeleteDoc,
    MarketplaceProviderUpdateDoc,
} from '@modules/marketplace/docs/marketplace.provider.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';

@ApiTags('modules.provider.marketplace')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/marketplace',
})
export class MarketplaceProviderController {
    constructor(private readonly marketplaceService: MarketplaceService) {}

    @MarketplaceProviderCreateDoc()
    @Response('marketplace.create')
    @RoleProtected(EnumRoleType.provider, EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/')
    async create(
        @AuthJwtPayload('userId') userId: string,
        @Body() body: MarketplaceCreateListingRequestDto
    ): Promise<IResponseReturn<MarketplaceListing>> {
        return this.marketplaceService.createListing(userId, body);
    }

    @MarketplaceProviderUpdateDoc()
    @Response('marketplace.update')
    @RoleProtected(EnumRoleType.provider, EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/:id')
    async update(
        @Param('id') id: string,
        @AuthJwtPayload('userId') userId: string,
        @Body() body: MarketplaceUpdateListingRequestDto
    ): Promise<IResponseReturn<MarketplaceListing>> {
        return this.marketplaceService.updateListing(id, userId, body);
    }

    @MarketplaceProviderDeleteDoc()
    @Response('marketplace.delete')
    @RoleProtected(EnumRoleType.provider, EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/:id')
    async delete(
        @Param('id') id: string,
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<{ success: boolean }>> {
        return this.marketplaceService.deleteListing(id, userId);
    }
}
