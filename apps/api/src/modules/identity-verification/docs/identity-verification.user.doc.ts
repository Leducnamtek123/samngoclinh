import {
    Doc,
    DocAuth,
    DocGuard,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { IdentityVerificationStatusResponseDto } from '@modules/identity-verification/dtos/response/identity-verification.status.response.dto';
import { IdentityVerificationSubmitResponseDto } from '@modules/identity-verification/dtos/response/identity-verification.submit.response.dto';

export function IdentityVerificationUserStatusDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get user identity verification status',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('identityVerification.status', {
            dto: IdentityVerificationStatusResponseDto,
        })
    );
}

export function IdentityVerificationUserSubmitDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Submit identity verification request',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('identityVerification.submit', {
            dto: IdentityVerificationSubmitResponseDto,
        })
    );
}
