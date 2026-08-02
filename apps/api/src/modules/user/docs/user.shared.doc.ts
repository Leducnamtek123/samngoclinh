import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocRequestFile,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';
import { FileUploadSingleRequestDto } from '@common/file/dtos/file.single.dto';
import { AuthTokenResponseDto } from '@modules/auth/dtos/response/auth.token.response.dto';
import {
    UserDocParamsAddressId,
    UserDocParamsMobileNumberId,
} from '@modules/user/constants/user.doc.constant';
import { UserAddAddressRequestDto } from '@modules/user/dtos/request/user.address.request.dto';
import { UserSaveIdentityDocumentRequestDto } from '@modules/user/dtos/request/user.identity-document.request.dto';
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
import { UserIdentityDocumentResponseDto } from '@modules/user/dtos/user.identity-document.dto';
import { UserMobileNumberResponseDto } from '@modules/user/dtos/user.mobile-number.dto';
import { HttpStatus, applyDecorators } from '@nestjs/common';

export function UserSharedRefreshDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'refresh token',
        }),
        DocAuth({
            xApiKey: true,
            jwtRefreshToken: true,
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocResponse<AuthTokenResponseDto>('user.response', {
            dto: AuthTokenResponseDto,
        })
    );
}

export function UserSharedProfileDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get profile',
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse<UserProfileResponseDto>('user.profile', {
            dto: UserProfileResponseDto,
        })
    );
}

export function UserSharedUpdateProfileDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'update profile',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: UserUpdateProfileRequestDto,
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.updateProfile')
    );
}

export function UserSharedUploadPhotoProfileDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'upload photo profile',
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocRequestFile({
            dto: FileUploadSingleRequestDto,
        }),
        DocResponse('user.uploadPhotoProfile')
    );
}

export function UserSharedChangePasswordDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'change password',
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: UserChangePasswordRequestDto,
        }),
        DocResponse('user.changePassword')
    );
}

export function UserSharedAddMobileNumberDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'user add mobile number',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: UserAddMobileNumberRequestDto,
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.addMobileNumber', {
            httpStatus: HttpStatus.CREATED,
            dto: UserMobileNumberResponseDto,
        })
    );
}

export function UserSharedUpdateMobileNumberDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'user update mobile number',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: UserUpdateMobileNumberRequestDto,
            params: UserDocParamsMobileNumberId,
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.updateMobileNumber', {
            dto: UserMobileNumberResponseDto,
        })
    );
}

export function UserSharedDeleteMobileNumberDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'user delete mobile number',
        }),
        DocRequest({
            params: UserDocParamsMobileNumberId,
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.deleteMobileNumber', {
            dto: UserMobileNumberResponseDto,
        })
    );
}

export function UserSharedAddAddressDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'user add address',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: UserAddAddressRequestDto,
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.addAddress', {
            httpStatus: HttpStatus.CREATED,
            dto: UserAddressResponseDto,
        })
    );
}

export function UserSharedGetIdentityDocumentDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'user get identity document (CCCD front/back)',
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.getIdentityDocument', {
            dto: UserIdentityDocumentResponseDto,
        })
    );
}

export function UserSharedSaveIdentityDocumentDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'user save identity document (CCCD front/back, no verification)',
        }),
        DocRequestFile({
            dto: UserSaveIdentityDocumentRequestDto,
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.saveIdentityDocument', {
            dto: UserIdentityDocumentResponseDto,
        })
    );
}

export function UserSharedRequestEmailVerificationDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'user request email verification OTP',
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.requestEmailVerification')
    );
}

export function UserSharedConfirmEmailVerificationDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'user confirm email verification OTP',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: UserConfirmEmailVerificationRequestDto,
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.confirmEmailVerification')
    );
}

export function UserSharedDeleteAddressDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'user delete address',
        }),
        DocRequest({
            params: UserDocParamsAddressId,
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.deleteAddress', {
            dto: UserAddressResponseDto,
        })
    );
}

export function UserSharedClaimUsernameDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'user claim username',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: UserClaimUsernameRequestDto,
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.claimUsername')
    );
}

export function UserSharedTwoFactorSetupDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Start two-factor setup and receive secret',
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.twoFactor.setup', {
            dto: UserTwoFactorSetupResponseDto,
        })
    );
}

export function UserSharedTwoFactorStatusDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get current two-factor authentication status',
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.twoFactor.status', {
            dto: UserTwoFactorStatusResponseDto,
        })
    );
}

export function UserSharedTwoFactorEnableDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Enable two-factor authentication',
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: UserTwoFactorEnableRequestDto,
        }),
        DocResponse('user.twoFactor.enable', {
            dto: UserTwoFactorEnableResponseDto,
        })
    );
}

export function UserSharedTwoFactorDisableDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Disable two-factor authentication',
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: UserTwoFactorDisableRequestDto,
        }),
        DocResponse('user.twoFactor.disable')
    );
}

export function UserSharedTwoFactorRegenerateBackupDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Regenerate two-factor backup codes',
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.twoFactor.regenerate', {
            dto: UserTwoFactorEnableResponseDto,
        })
    );
}

export function UserSharedLogoutDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary:
                'Logout from current session, invalidating the access token and deleting the session.',
        }),
        DocGuard({
            termPolicy: true,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocResponse('user.logout')
    );
}
