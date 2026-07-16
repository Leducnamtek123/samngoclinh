import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { EnumRoleType } from '@generated/prisma-client';
import { ProviderDashboardService } from '@modules/provider-dashboard/services/provider-dashboard.service';
import { ProviderDashboardSystemOverviewDoc } from '@modules/provider-dashboard/docs/provider-dashboard.system.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ProviderDashboardOverviewResponseDto } from '@modules/provider-dashboard/dtos/response/provider-dashboard.overview.response.dto';

@ApiTags('modules.system.provider-dashboard')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/provider-dashboard',
})
export class ProviderDashboardSystemController {
    constructor(
        private readonly providerDashboardService: ProviderDashboardService
    ) {}

    @ProviderDashboardSystemOverviewDoc()
    @Response('providerDashboard.overview')
    @RoleProtected(EnumRoleType.provider)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/overview')
    async overview(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<ProviderDashboardOverviewResponseDto>> {
        return this.providerDashboardService.overview(userId);
    }
}
