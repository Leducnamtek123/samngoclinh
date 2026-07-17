import {
    Body,
    Controller,
    Get,
    Param,
    Put,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { EnumRoleType } from '@generated/prisma-client';
import { SettingService } from '@modules/setting/services/setting.service';
import {
    SettingAdminGetDoc,
    SettingAdminListDoc,
    SettingAdminUpdateDoc,
} from '@modules/setting/docs/setting.admin.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { SettingAdminUpdateRequestDto } from '@modules/setting/dtos/request/setting.admin-update.request.dto';
import { SystemSetting } from '@generated/prisma-client';

@ApiTags('modules.admin.setting')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/settings',
})
export class SettingAdminController {
    constructor(private readonly settingService: SettingService) {}

    @SettingAdminListDoc()
    @Response('setting.list')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/')
    async list(): Promise<IResponseReturn<{ items: SystemSetting[] }>> {
        return this.settingService.listSettings();
    }

    @SettingAdminGetDoc()
    @Response('setting.detail')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/:key')
    async getSetting(
        @Param('key') key: string
    ): Promise<IResponseReturn<SystemSetting>> {
        return this.settingService.getSetting(key);
    }

    @SettingAdminUpdateDoc()
    @Response('setting.update')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/:key')
    async update(
        @Param('key') key: string,
        @Body() body: SettingAdminUpdateRequestDto
    ): Promise<IResponseReturn<SystemSetting>> {
        return this.settingService.updateSetting(key, body.value);
    }
}
