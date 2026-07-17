import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { SettingAdminUpdateRequestDto } from '@modules/setting/dtos/request/setting.admin-update.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function SettingAdminListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List all system configuration settings (Admin)',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('setting.list')
    );
}

export function SettingAdminUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Update or create a system configuration setting (Admin)',
        }),
        DocRequest({
            params: [
                {
                    name: 'key',
                    description: 'Setting key, e.g., "shipping_fee"',
                    required: true,
                    type: 'string',
                },
            ],
            bodyType: EnumDocRequestBodyType.json,
            dto: SettingAdminUpdateRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('setting.update')
    );
}

export function SettingAdminGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get details of a system setting key',
        }),
        DocRequest({
            params: [
                {
                    name: 'key',
                    description: 'Setting key',
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
        DocResponse('setting.detail')
    );
}
