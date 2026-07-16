import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { IdentityVerificationRejectRequestDto } from '@modules/identity-verification/dtos/request/identity-verification.reject.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function IdentityVerificationAdminListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List all pending KYC verification requests',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('identityVerification.adminListPending')
    );
}

export function IdentityVerificationAdminApproveDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Approve a KYC verification request',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'KYC request ID',
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
        DocResponse('identityVerification.adminApprove')
    );
}

export function IdentityVerificationAdminRejectDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Reject a KYC verification request',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'KYC request ID',
                    required: true,
                    type: 'string',
                },
            ],
            bodyType: EnumDocRequestBodyType.json,
            dto: IdentityVerificationRejectRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('identityVerification.adminReject')
    );
}
