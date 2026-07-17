import {
    Doc,
    DocAuth,
    DocGuard,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { ProfileSummaryResponseDto } from '@modules/profile/dtos/response/profile.summary.response.dto';

export function ProfileUserMeDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get current user profile',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('profile.me', {
            dto: ProfileSummaryResponseDto,
        })
    );
}

export function ProfileUserBusinessDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get current user business profile details (distributor info)',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('profile.me')
    );
}

