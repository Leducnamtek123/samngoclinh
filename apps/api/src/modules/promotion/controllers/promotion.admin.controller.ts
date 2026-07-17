import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { EnumRoleType } from '@generated/prisma-client';
import { PromotionService } from '@modules/promotion/services/promotion.service';
import {
    PromotionAdminCreateDoc,
    PromotionAdminDeleteDoc,
    PromotionAdminListDoc,
    PromotionAdminUpdateDoc,
} from '@modules/promotion/docs/promotion.admin.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { PromotionAdminCreateRequestDto } from '@modules/promotion/dtos/request/promotion.admin-create.request.dto';
import { PromotionAdminUpdateRequestDto } from '@modules/promotion/dtos/request/promotion.admin-update.request.dto';

@ApiTags('modules.admin.promotion')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/admin/promotion/campaigns',
})
export class PromotionAdminController {
    constructor(private readonly promotionService: PromotionService) {}

    @PromotionAdminListDoc()
    @Response('promotion.freeTree')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/')
    async list(): Promise<IResponseReturn<{ items: any[] }>> {
        return this.promotionService.adminListCampaigns();
    }

    @PromotionAdminCreateDoc()
    @Response('promotion.freeTree')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/')
    async create(
        @Body() body: PromotionAdminCreateRequestDto
    ): Promise<IResponseReturn<any>> {
        return this.promotionService.adminCreateCampaign(body);
    }

    @PromotionAdminUpdateDoc()
    @Response('promotion.freeTree')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/:id')
    async update(
        @Param('id') id: string,
        @Body() body: PromotionAdminUpdateRequestDto
    ): Promise<IResponseReturn<any>> {
        return this.promotionService.adminUpdateCampaign(id, body);
    }

    @PromotionAdminDeleteDoc()
    @Response('promotion.freeTree')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/:id')
    async delete(
        @Param('id') id: string
    ): Promise<IResponseReturn<void>> {
        return this.promotionService.adminDeleteCampaign(id);
    }
}
