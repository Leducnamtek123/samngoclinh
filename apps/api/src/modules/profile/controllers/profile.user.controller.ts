import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { BusinessProfile, EnumRoleType } from '@generated/prisma-client';
import { ProfileService } from '@modules/profile/services/profile.service';
import { ProfileUserBusinessDoc, ProfileUserMeDoc } from '@modules/profile/docs/profile.user.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ProfileSummaryResponseDto } from '@modules/profile/dtos/response/profile.summary.response.dto';

@ApiTags('modules.user.profile')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/profile',
})
export class ProfileUserController {
    constructor(private readonly profileService: ProfileService) {}

    @ProfileUserMeDoc()
    @Response('profile.me')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin, EnumRoleType.provider, EnumRoleType.user)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/me')
    async me(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<ProfileSummaryResponseDto>> {
        return this.profileService.me(userId);
    }

    @ProfileUserBusinessDoc()
    @Response('profile.me')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin, EnumRoleType.provider, EnumRoleType.user)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/business')
    async businessProfile(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<BusinessProfile>> {
        return this.profileService.userBusinessProfile(userId);
    }
}
