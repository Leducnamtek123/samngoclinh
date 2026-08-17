import {
    FileUploadMultipleFields,
    FileUploadSingle,
} from '@common/file/decorators/file.decorator';
import { EnumFileExtensionImage } from '@common/file/enums/file.enum';
import { IFile } from '@common/file/interfaces/file.interface';
import { FileExtensionPipe } from '@common/file/pipes/file.extension.pipe';
import { RequestTimeout } from '@common/request/decorators/request.decorator';
import { RequestIsValidObjectIdPipe } from '@common/request/pipes/request.is-valid-object-id.pipe';
import { RequestRequiredPipe } from '@common/request/pipes/request.required.pipe';
import { Response } from '@common/response/decorators/response.decorator';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
    AuthJwtRefreshProtected,
    AuthJwtToken,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { AuthTokenResponseDto } from '@modules/auth/dtos/response/auth.token.response.dto';
import { IAuthJwtAccessTokenPayload } from '@modules/auth/interfaces/auth.interface';
import { FeatureFlagProtected } from '@modules/feature-flag/decorators/feature-flag.decorator';
import { TermPolicyAcceptanceProtected } from '@modules/term-policy/decorators/term-policy.decorator';
import {
    UserCurrent,
    UserProtected,
} from '@modules/user/decorators/user.decorator';
import {
    UserSharedAddAddressDoc,
    UserSharedAddMobileNumberDoc,
    UserSharedChangePasswordDoc,
    UserSharedClaimUsernameDoc,
    UserSharedConfirmEmailVerificationDoc,
    UserSharedDeleteAddressDoc,
    UserSharedDeleteMobileNumberDoc,
    UserSharedGetIdentityDocumentDoc,
    UserSharedLogoutDoc,
    UserSharedProfileDoc,
    UserSharedRefreshDoc,
    UserSharedRequestEmailVerificationDoc,
    UserSharedSaveIdentityDocumentDoc,
    UserSharedTwoFactorDisableDoc,
    UserSharedTwoFactorEnableDoc,
    UserSharedTwoFactorRegenerateBackupDoc,
    UserSharedTwoFactorSetupDoc,
    UserSharedTwoFactorStatusDoc,
    UserSharedUpdateMobileNumberDoc,
    UserSharedUpdateProfileDoc,
    UserSharedUploadPhotoProfileDoc,
} from '@modules/user/docs/user.shared.doc';
import { UserAddAddressRequestDto } from '@modules/user/dtos/request/user.address.request.dto';
import { UserConfirmEmailVerificationRequestDto } from '@modules/user/dtos/request/user.confirm-email-verification.request.dto';
import { UserChangePasswordRequestDto } from '@modules/user/dtos/request/user.change-password.request.dto';
import { UserClaimUsernameRequestDto } from '@modules/user/dtos/request/user.claim-username.request.dto';
import {
    UserAddMobileNumberRequestDto,
    UserUpdateMobileNumberRequestDto,
} from '@modules/user/dtos/request/user.mobile-number.request.dto';
import { UserUpdateProfileRequestDto } from '@modules/user/dtos/request/user.profile.request.dto';
import { UserTwoFactorDisableRequestDto } from '@modules/user/dtos/request/user.two-factor-disable.request.dto';
import { UserTwoFactorEnableRequestDto } from '@modules/user/dtos/request/user.two-factor-enable.request.dto';
import { UserProfileResponseDto } from '@modules/user/dtos/response/user.profile.response.dto';
import { UserTwoFactorEnableResponseDto } from '@modules/user/dtos/response/user.two-factor-enable.response.dto';
import { UserTwoFactorSetupResponseDto } from '@modules/user/dtos/response/user.two-factor-setup.response.dto';
import { UserTwoFactorStatusResponseDto } from '@modules/user/dtos/response/user.two-factor-status.response.dto';
import { UserAddressResponseDto } from '@modules/user/dtos/user.address.dto';
import {
    UserIdentityDocumentResponseDto,
    UserIdentityHistoryResponseDto,
} from '@modules/user/dtos/user.identity-document.dto';
import { UserMobileNumberResponseDto } from '@modules/user/dtos/user.mobile-number.dto';
import { IUser } from '@modules/user/interfaces/user.interface';
import { UserService } from '@modules/user/services/user.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Put,
    UploadedFile,
    UploadedFiles,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('modules.shared.user')
@Controller({
    version: '1',
    path: '/user',
})
export class UserSharedController {
    constructor(private readonly userService: UserService) {}

    @UserSharedRefreshDoc()
    @Response('user.refresh')
    @TermPolicyAcceptanceProtected()
    // @note email verification not required (verification handled in the profile flow)
    @UserProtected(false)
    @AuthJwtRefreshProtected()
    @ApiKeyProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/refresh')
    async refresh(
        @UserCurrent() user: IUser,
        @AuthJwtToken() refreshToken: string
    ): Promise<IResponseReturn<AuthTokenResponseDto>> {
        return this.userService.refresh(user, refreshToken);
    }

    @UserSharedProfileDoc()
    @Response('user.profile')
    @TermPolicyAcceptanceProtected()
    // @note email verification not required (verification handled in the profile flow)
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get(['/profile', '/profile/me'])
    async profile(
        @AuthJwtPayload('userId')
        userId: string
    ): Promise<IResponseReturn<UserProfileResponseDto>> {
        return this.userService.getProfile(userId);
    }

    @UserSharedUpdateProfileDoc()
    @Response('user.updateProfile')
    @TermPolicyAcceptanceProtected()
    // @note email verification not required (verification handled in the profile flow)
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/profile/update')
    async updateProfile(
        @AuthJwtPayload('userId')
        userId: string,
        @Body()
        body: UserUpdateProfileRequestDto
    ): Promise<void> {
        return this.userService.updateProfile(userId, body);
    }

    @UserSharedUploadPhotoProfileDoc()
    @Response('user.uploadPhotoProfile')
    @TermPolicyAcceptanceProtected()
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @FileUploadSingle()
    @RequestTimeout('1m')
    @HttpCode(HttpStatus.OK)
    @Post('/profile/upload/photo')
    async uploadPhotoProfile(
        @AuthJwtPayload('userId')
        userId: string,
        @UploadedFile(
            RequestRequiredPipe,
            FileExtensionPipe([
                EnumFileExtensionImage.jpeg,
                EnumFileExtensionImage.png,
                EnumFileExtensionImage.jpg,
            ])
        )
        file: IFile
    ): Promise<void> {
        return this.userService.uploadPhotoProfile(userId, file);
    }

    @UserSharedChangePasswordDoc()
    @Response('user.changePassword')
    @TermPolicyAcceptanceProtected()
    // @note email verification not required (verification handled in the profile flow)
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @FeatureFlagProtected('changePassword')
    @ApiKeyProtected()
    @Patch('/change-password')
    async changePassword(
        @UserCurrent() user: IUser,
        @Body() body: UserChangePasswordRequestDto
    ): Promise<void> {
        return this.userService.changePassword(user, body);
    }

    @UserSharedAddMobileNumberDoc()
    @Response('user.addMobileNumber')
    @TermPolicyAcceptanceProtected()
    // @note email verification not required (verification handled in the profile flow)
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/mobile-number/add')
    async addMobileNumber(
        @AuthJwtPayload('userId') userId: string,
        @Body()
        body: UserAddMobileNumberRequestDto
    ): Promise<IResponseReturn<UserMobileNumberResponseDto>> {
        return this.userService.addMobileNumber(userId, body);
    }

    @UserSharedUpdateMobileNumberDoc()
    @Response('user.updateMobileNumber')
    @TermPolicyAcceptanceProtected()
    // @note email verification not required (verification handled in the profile flow)
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/mobile-number/update/:mobileNumberId')
    async updateMobileNumber(
        @AuthJwtPayload('userId') userId: string,
        @Param(
            'mobileNumberId',
            RequestRequiredPipe,
            RequestIsValidObjectIdPipe
        )
        mobileNumberId: string,
        @Body()
        body: UserUpdateMobileNumberRequestDto
    ): Promise<IResponseReturn<UserMobileNumberResponseDto>> {
        return this.userService.updateMobileNumber(
            userId,
            mobileNumberId,
            body
        );
    }

    @UserSharedDeleteMobileNumberDoc()
    @Response('user.deleteMobileNumber')
    @TermPolicyAcceptanceProtected()
    // @note email verification not required (verification handled in the profile flow)
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/mobile-number/delete/:mobileNumberId')
    async deleteMobileNumber(
        @AuthJwtPayload('userId') userId: string,
        @Param(
            'mobileNumberId',
            RequestRequiredPipe,
            RequestIsValidObjectIdPipe
        )
        mobileNumberId: string
    ): Promise<IResponseReturn<UserMobileNumberResponseDto>> {
        return this.userService.deleteMobileNumber(userId, mobileNumberId);
    }

    @UserSharedAddAddressDoc()
    @Response('user.addAddress')
    @TermPolicyAcceptanceProtected()
    // @note email verification not required (verification handled in the profile flow)
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/address/add')
    async addAddress(
        @AuthJwtPayload('userId') userId: string,
        @Body()
        body: UserAddAddressRequestDto
    ): Promise<IResponseReturn<UserAddressResponseDto>> {
        return this.userService.addAddress(userId, {
            detail: body.detail,
            label: body.label ?? null,
            recipient: body.recipient ?? null,
            phone: body.phone ?? null,
            isDefault: body.isDefault ?? false,
        });
    }

    @UserSharedGetIdentityDocumentDoc()
    @Response('user.getIdentityDocument')
    @TermPolicyAcceptanceProtected()
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/identity-document')
    async getIdentityDocument(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<UserIdentityDocumentResponseDto | null>> {
        return this.userService.getIdentityDocument(userId);
    }

    @Response('user.getIdentityDocumentHistories')
    @TermPolicyAcceptanceProtected()
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/identity-document/history')
    async getIdentityDocumentHistories(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<UserIdentityHistoryResponseDto[]>> {
        return this.userService.getIdentityDocumentHistories(userId);
    }

    @UserSharedSaveIdentityDocumentDoc()
    @Response('user.saveIdentityDocument')
    @TermPolicyAcceptanceProtected()
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @FileUploadMultipleFields([
        { field: 'front', maxFiles: 1 },
        { field: 'back', maxFiles: 1 },
        { field: 'frontImage', maxFiles: 1 },
        { field: 'backImage', maxFiles: 1 },
    ])
    @RequestTimeout('1m')
    @Put('/identity-document')
    async saveIdentityDocument(
        @AuthJwtPayload('userId') userId: string,
        @UploadedFiles()
        files?: {
            front?: IFile[];
            back?: IFile[];
            frontImage?: IFile[];
            backImage?: IFile[];
        },
        @Body()
        body?: {
            front?: string;
            back?: string;
            frontImage?: string;
            backImage?: string;
            frontBase64?: string;
            backBase64?: string;
            documentType?: string;
            idCardNumber?: string;
            fullName?: string;
        }
    ): Promise<IResponseReturn<UserIdentityDocumentResponseDto>> {
        const frontFile = files?.front?.[0] ?? files?.frontImage?.[0] ?? null;
        const backFile = files?.back?.[0] ?? files?.backImage?.[0] ?? null;
        const frontStr = body?.frontBase64 || body?.front || body?.frontImage;
        const backStr = body?.backBase64 || body?.back || body?.backImage;

        return this.userService.saveIdentityDocument(
            userId,
            frontFile,
            backFile,
            frontStr,
            backStr,
            body?.documentType || 'cccd',
            body?.idCardNumber,
            body?.fullName
        );
    }

    @Response('user.getSignature')
    @TermPolicyAcceptanceProtected()
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/signature')
    async getSignature(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<{ signatureUrl: string | null }>> {
        return this.userService.getSignature(userId);
    }

    @Response('user.saveSignature')
    @TermPolicyAcceptanceProtected()
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @FileUploadSingle()
    @Put('/signature')
    async saveSignature(
        @AuthJwtPayload('userId') userId: string,
        @Body('signatureData') signatureData?: string,
        @UploadedFile() file?: IFile
    ): Promise<IResponseReturn<{ signatureUrl: string }>> {
        return this.userService.saveSignature(userId, signatureData, file);
    }

    @UserSharedRequestEmailVerificationDoc()
    @Response('user.requestEmailVerification')
    @TermPolicyAcceptanceProtected()
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/verify-email/request')
    async requestEmailVerification(
        @AuthJwtPayload('userId') userId: string
    ): Promise<void> {
        return this.userService.requestEmailVerificationOtp(userId);
    }

    @UserSharedConfirmEmailVerificationDoc()
    @Response('user.confirmEmailVerification')
    @TermPolicyAcceptanceProtected()
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/verify-email/confirm')
    async confirmEmailVerification(
        @AuthJwtPayload('userId') userId: string,
        @Body()
        body: UserConfirmEmailVerificationRequestDto
    ): Promise<void> {
        return this.userService.confirmEmailVerificationOtp(userId, body);
    }

    @UserSharedDeleteAddressDoc()
    @Response('user.deleteAddress')
    @TermPolicyAcceptanceProtected()
    // @note email verification not required (verification handled in the profile flow)
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/address/delete/:addressId')
    async deleteAddress(
        @AuthJwtPayload('userId') userId: string,
        @Param('addressId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
        addressId: string
    ): Promise<IResponseReturn<UserAddressResponseDto>> {
        return this.userService.deleteAddress(userId, addressId);
    }

    @UserSharedClaimUsernameDoc()
    @Response('user.claimUsername')
    @TermPolicyAcceptanceProtected()
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/username/claim')
    async claimUsername(
        @AuthJwtPayload('userId') userId: string,
        @Body()
        body: UserClaimUsernameRequestDto
    ): Promise<void> {
        return this.userService.claimUsername(userId, body);
    }

    @UserSharedTwoFactorStatusDoc()
    @Response('user.twoFactor.status')
    @TermPolicyAcceptanceProtected()
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/2fa/status')
    async getTwoFactorStatus(
        @UserCurrent() user: IUser
    ): Promise<IResponseReturn<UserTwoFactorStatusResponseDto>> {
        return this.userService.getTwoFactorStatus(user);
    }

    @UserSharedTwoFactorSetupDoc()
    @Response('user.twoFactor.setup')
    @TermPolicyAcceptanceProtected()
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/2fa/setup')
    async setupTwoFactor(
        @UserCurrent() user: IUser
    ): Promise<IResponseReturn<UserTwoFactorSetupResponseDto>> {
        return this.userService.setupTwoFactor(user);
    }

    @UserSharedTwoFactorEnableDoc()
    @Response('user.twoFactor.enable')
    @TermPolicyAcceptanceProtected()
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/2fa/enable')
    async enableTwoFactor(
        @UserCurrent() user: IUser,
        @Body() body: UserTwoFactorEnableRequestDto
    ): Promise<IResponseReturn<UserTwoFactorEnableResponseDto>> {
        return this.userService.enableTwoFactor(user, body);
    }

    @UserSharedTwoFactorDisableDoc()
    @Response('user.twoFactor.disable')
    @TermPolicyAcceptanceProtected()
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @HttpCode(HttpStatus.OK)
    @Delete('/2fa/disable')
    async disableTwoFactor(
        @UserCurrent() user: IUser,
        @Body() body: UserTwoFactorDisableRequestDto
    ): Promise<void> {
        return this.userService.disableTwoFactor(user, body);
    }

    @UserSharedTwoFactorRegenerateBackupDoc()
    @Response('user.twoFactor.regenerateBackupCodes')
    @TermPolicyAcceptanceProtected()
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/2fa/regenerate-backup-codes')
    async regenerateTwoFactorBackupCodes(
        @UserCurrent() user: IUser
    ): Promise<IResponseReturn<UserTwoFactorEnableResponseDto>> {
        return this.userService.regenerateTwoFactorBackupCodes(user);
    }

    @UserSharedLogoutDoc()
    @Response('user.logout')
    @TermPolicyAcceptanceProtected()
    // @note email verification not required (verification handled in the profile flow)
    @UserProtected(false)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/logout')
    async logout(
        @AuthJwtPayload() { sessionId, userId }: IAuthJwtAccessTokenPayload
    ): Promise<void> {
        return this.userService.logout(userId, sessionId);
    }

    // TODO: Verify number implementation, but which provider?
}
