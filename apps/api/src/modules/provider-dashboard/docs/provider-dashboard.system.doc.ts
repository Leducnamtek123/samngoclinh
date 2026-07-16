import {
    Doc,
    DocAuth,
    DocGuard,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { ProviderDashboardOverviewResponseDto } from '@modules/provider-dashboard/dtos/response/provider-dashboard.overview.response.dto';

export function ProviderDashboardSystemOverviewDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get provider dashboard overview metrics',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('providerDashboard.overview', {
            dto: ProviderDashboardOverviewResponseDto,
        })
    );
}
