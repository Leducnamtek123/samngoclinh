import { Body, Controller, Get, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected, AuthJwtPayload } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { CarePackage, CultivationTree, EnumRoleType, ProtectionPackage } from '@generated/prisma-client';
import { PackagesService } from '../services/packages.service';
import { PackageSubscribeRequestDto } from '../dtos/packages.dto';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import {
    PackagesUserListCareDoc,
    PackagesUserListProtectionDoc,
    PackagesUserSubscribeDoc,
} from '../docs/packages.user.doc';

@ApiTags('modules.user.packages')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/user/packages',
})
export class PackagesUserController {
    constructor(private readonly packagesService: PackagesService) {}

    @PackagesUserListCareDoc()
    @Response('packages.list')
    @RoleProtected(EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/care')
    async listCare(): Promise<IResponseReturn<{ items: CarePackage[] }>> {
        return this.packagesService.listCare();
    }

    @PackagesUserListProtectionDoc()
    @Response('packages.list')
    @RoleProtected(EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/protection')
    async listProtection(): Promise<IResponseReturn<{ items: ProtectionPackage[] }>> {
        return this.packagesService.listProtection();
    }

    @PackagesUserSubscribeDoc()
    @Response('packages.subscribe')
    @RoleProtected(EnumRoleType.user)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/subscribe')
    async subscribe(
        @AuthJwtPayload('userId') userId: string,
        @Body() body: PackageSubscribeRequestDto
    ): Promise<IResponseReturn<CultivationTree>> {
        return this.packagesService.subscribe(userId, body);
    }
}
