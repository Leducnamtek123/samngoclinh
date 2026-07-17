import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { EnumRoleType } from '@generated/prisma-client';
import { BackofficeService } from '@modules/backoffice/services/backoffice.service';
import { BackofficeAdminOverviewDoc } from '@modules/backoffice/docs/backoffice.admin.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { BackofficeOverviewResponseDto } from '@modules/backoffice/dtos/response/backoffice.overview.response.dto';

@ApiTags('modules.admin.backoffice')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/backoffice',
})
export class BackofficeAdminController {
    constructor(private readonly backofficeService: BackofficeService) {}

    @BackofficeAdminOverviewDoc()
    @Response('backoffice.overview')
    @RoleProtected(EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/overview')
    async overview(): Promise<IResponseReturn<BackofficeOverviewResponseDto>> {
        return this.backofficeService.overview();
    }
}
