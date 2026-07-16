import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import {
    EnumRoleType,
    IdentityVerificationRequest,
} from '@generated/prisma-client';
import { IdentityVerificationService } from '@modules/identity-verification/services/identity-verification.service';
import { IdentityVerificationRejectRequestDto } from '@modules/identity-verification/dtos/request/identity-verification.reject.request.dto';
import {
    IdentityVerificationAdminApproveDoc,
    IdentityVerificationAdminListDoc,
    IdentityVerificationAdminRejectDoc,
} from '@modules/identity-verification/docs/identity-verification.admin.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';

@ApiTags('modules.admin.identity-verification')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/identity-verification',
})
export class IdentityVerificationAdminController {
    constructor(
        private readonly identityVerificationService: IdentityVerificationService
    ) {}

    @IdentityVerificationAdminListDoc()
    @Response('identityVerification.adminListPending')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/')
    async listPending(): Promise<
        IResponseReturn<{ items: IdentityVerificationRequest[] }>
    > {
        return this.identityVerificationService.adminListPending();
    }

    @IdentityVerificationAdminApproveDoc()
    @Response('identityVerification.adminApprove')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Patch('/:id/approve')
    async approve(
        @Param('id') id: string
    ): Promise<IResponseReturn<{ success: boolean }>> {
        return this.identityVerificationService.adminApprove(id);
    }

    @IdentityVerificationAdminRejectDoc()
    @Response('identityVerification.adminReject')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Patch('/:id/reject')
    async reject(
        @Param('id') id: string,
        @Body() body: IdentityVerificationRejectRequestDto
    ): Promise<IResponseReturn<{ success: boolean }>> {
        return this.identityVerificationService.adminReject(id, body);
    }
}
