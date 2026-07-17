import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { ProfileAdminUpdateRankRequestDto } from '@modules/profile/dtos/request/profile.admin-update-rank.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function ProfileAdminListBusinessDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List all CTV/Đại lý distributor profiles (Admin)',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('profile.me')
    );
}

export function ProfileAdminUpdateRankDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Update rank status of CTV/Đại lý (Admin)',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Business Profile ID',
                    required: true,
                    type: 'string',
                },
            ],
            bodyType: EnumDocRequestBodyType.json,
            dto: ProfileAdminUpdateRankRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('profile.me')
    );
}
