import { Body, Controller, Get, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { EnumRoleType } from '@generated/prisma-client';
import { IdentityVerificationService } from '@modules/identity-verification/services/identity-verification.service';
import { IdentityVerificationSubmitRequestDto } from '@modules/identity-verification/dtos/request/identity-verification.submit.request.dto';
import {
    IdentityVerificationUserStatusDoc,
    IdentityVerificationUserSubmitDoc,
} from '@modules/identity-verification/docs/identity-verification.user.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { IdentityVerificationStatusResponseDto } from '@modules/identity-verification/dtos/response/identity-verification.status.response.dto';
import { IdentityVerificationSubmitResponseDto } from '@modules/identity-verification/dtos/response/identity-verification.submit.response.dto';

@ApiTags('modules.user.identity-verification')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/identity-verification',
})
export class IdentityVerificationUserController {
    constructor(
        private readonly identityVerificationService: IdentityVerificationService
    ) {}

    @IdentityVerificationUserStatusDoc()
    @Response('identityVerification.status')
    @RoleProtected(EnumRoleType.user)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/status')
    async status(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<IdentityVerificationStatusResponseDto>> {
        return this.identityVerificationService.status(userId);
    }

    @IdentityVerificationUserSubmitDoc()
    @Response('identityVerification.submit')
    @RoleProtected(EnumRoleType.user)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/submit')
    async submit(
        @AuthJwtPayload('userId') userId: string,
        @Body() body: IdentityVerificationSubmitRequestDto
    ): Promise<IResponseReturn<IdentityVerificationSubmitResponseDto>> {
        return this.identityVerificationService.submit(userId, body);
    }
}
