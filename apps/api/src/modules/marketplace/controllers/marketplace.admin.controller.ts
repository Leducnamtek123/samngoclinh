import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { EnumRoleType, MarketplaceListing } from '@generated/prisma-client';
import { MarketplaceService } from '@modules/marketplace/services/marketplace.service';
import {
    MarketplaceAdminListDoc,
    MarketplaceAdminUpdateStatusDoc,
} from '@modules/marketplace/docs/marketplace.admin.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { MarketplaceAdminUpdateStatusRequestDto } from '@modules/marketplace/dtos/request/marketplace.admin-update-status.request.dto';

@ApiTags('modules.admin.marketplace')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/admin/marketplace',
})
export class MarketplaceAdminController {
    constructor(private readonly marketplaceService: MarketplaceService) {}

    @MarketplaceAdminListDoc()
    @Response('marketplace.list')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/listings')
    async list(): Promise<IResponseReturn<{ items: MarketplaceListing[] }>> {
        return this.marketplaceService.listAllListings();
    }

    @MarketplaceAdminUpdateStatusDoc()
    @Response('marketplace.update')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Patch('/listings/:id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() body: MarketplaceAdminUpdateStatusRequestDto
    ): Promise<IResponseReturn<MarketplaceListing>> {
        return this.marketplaceService.adminUpdateStatus(id, body.status);
    }
}
