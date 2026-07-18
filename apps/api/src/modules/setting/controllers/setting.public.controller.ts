import {
    Controller,
    Get,
    Param,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { SettingService } from '@modules/setting/services/setting.service';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { SystemSetting } from '@generated/prisma-client';

@ApiTags('modules.public.setting')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/settings',
})
export class SettingPublicController {
    constructor(private readonly settingService: SettingService) {}

    @Response('setting.detail')
    @ApiKeyProtected()
    @Get('/:key')
    async getSetting(
        @Param('key') key: string
    ): Promise<IResponseReturn<SystemSetting>> {
        return this.settingService.getSetting(key);
    }
}
