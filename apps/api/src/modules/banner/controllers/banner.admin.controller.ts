import { Body, Controller, Get, Param, Post, Put, Delete, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { EnumRoleType, Banner } from '@generated/prisma-client';
import { BannerService } from '../services/banner.service';
import { UpsertBannerDto } from '../dtos/banner.dto';
import { IResponseReturn } from '@common/response/interfaces/response.interface';

@ApiTags('modules.admin.banner')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/banners',
})
export class BannerAdminController {
    constructor(private readonly bannerService: BannerService) {}

    @Response('banner.list')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/')
    async listBanners(): Promise<IResponseReturn<any[]>> {
        const data = await this.bannerService.listBanners();
        return { data };
    }

    @Response('banner.create')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/')
    async createBanner(
        @Body() body: UpsertBannerDto
    ): Promise<IResponseReturn<Banner>> {
        const data = await this.bannerService.createBanner(body);
        return { data };
    }

    @Response('banner.update')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/:id')
    async updateBanner(
        @Param('id') id: string,
        @Body() body: UpsertBannerDto
    ): Promise<IResponseReturn<Banner>> {
        const data = await this.bannerService.updateBanner(id, body);
        return { data };
    }

    @Response('banner.delete')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/:id')
    async deleteBanner(
        @Param('id') id: string
    ): Promise<IResponseReturn<Banner>> {
        const data = await this.bannerService.deleteBanner(id);
        return { data };
    }
}
