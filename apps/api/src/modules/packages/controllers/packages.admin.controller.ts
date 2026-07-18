import { Body, Controller, Delete, Get, Param, Post, Put, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { CarePackage, EnumRoleType, ProtectionPackage } from '@generated/prisma-client';
import { PackagesService } from '../services/packages.service';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import {
    CarePackageCreateRequestDto,
    CarePackageUpdateRequestDto,
    ProtectionPackageCreateRequestDto,
    ProtectionPackageUpdateRequestDto,
} from '../dtos/packages.dto';
import {
    PackagesAdminCreateCareDoc,
    PackagesAdminCreateProtectionDoc,
    PackagesAdminDeleteCareDoc,
    PackagesAdminDeleteProtectionDoc,
    PackagesAdminUpdateCareDoc,
    PackagesAdminUpdateProtectionDoc,
} from '../docs/packages.admin.doc';

@ApiTags('modules.admin.packages')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/packages',
})
export class PackagesAdminController {
    constructor(private readonly packagesService: PackagesService) {}

    @PackagesAdminCreateCareDoc()
    @Response('packages.create')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/care')
    async createCare(@Body() body: CarePackageCreateRequestDto): Promise<IResponseReturn<CarePackage>> {
        return this.packagesService.createCare(body);
    }

    @PackagesAdminUpdateCareDoc()
    @Response('packages.update')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/care/:id')
    async updateCare(@Param('id') id: string, @Body() body: CarePackageUpdateRequestDto): Promise<IResponseReturn<CarePackage>> {
        return this.packagesService.updateCare(id, body);
    }

    @PackagesAdminDeleteCareDoc()
    @Response('packages.delete')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/care/:id')
    async deleteCare(@Param('id') id: string): Promise<IResponseReturn<{ success: boolean }>> {
        return this.packagesService.deleteCare(id);
    }

    @PackagesAdminCreateProtectionDoc()
    @Response('packages.create')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/protection')
    async createProtection(@Body() body: ProtectionPackageCreateRequestDto): Promise<IResponseReturn<ProtectionPackage>> {
        return this.packagesService.createProtection(body);
    }

    @PackagesAdminUpdateProtectionDoc()
    @Response('packages.update')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/protection/:id')
    async updateProtection(@Param('id') id: string, @Body() body: ProtectionPackageUpdateRequestDto): Promise<IResponseReturn<ProtectionPackage>> {
        return this.packagesService.updateProtection(id, body);
    }

    @PackagesAdminDeleteProtectionDoc()
    @Response('packages.delete')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/protection/:id')
    async deleteProtection(@Param('id') id: string): Promise<IResponseReturn<{ success: boolean }>> {
        return this.packagesService.deleteProtection(id);
    }

    @Response('packages.list')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/care')
    async listAllCare(): Promise<IResponseReturn<{ items: CarePackage[] }>> {
        return this.packagesService.listAllCare();
    }

    @Response('packages.list')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/protection')
    async listAllProtection(): Promise<IResponseReturn<{ items: ProtectionPackage[] }>> {
        return this.packagesService.listAllProtection();
    }
}
