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
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { EnumRoleType } from '@generated/prisma-client';
import { ProfileService } from '@modules/profile/services/profile.service';
import {
    ProfileAdminListBusinessDoc,
    ProfileAdminUpdateRankDoc,
} from '@modules/profile/docs/profile.admin.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ProfileAdminUpdateRankRequestDto } from '@modules/profile/dtos/request/profile.admin-update-rank.request.dto';

@ApiTags('modules.admin.profile')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/admin/profile/business',
})
export class ProfileAdminController {
    constructor(private readonly profileService: ProfileService) {}

    @ProfileAdminListBusinessDoc()
    @Response('profile.me')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/')
    async list(): Promise<IResponseReturn<{ items: any[] }>> {
        return this.profileService.adminListBusinessProfiles();
    }

    @ProfileAdminUpdateRankDoc()
    @Response('profile.me')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Patch('/:id/rank')
    async updateRank(
        @Param('id') id: string,
        @Body() body: ProfileAdminUpdateRankRequestDto
    ): Promise<IResponseReturn<any>> {
        return this.profileService.adminUpdateRank(id, body.rank);
    }
}
