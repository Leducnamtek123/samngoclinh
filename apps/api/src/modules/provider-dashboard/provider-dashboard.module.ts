import { Module } from '@nestjs/common';
import { ProviderDashboardRepository } from '@modules/provider-dashboard/repositories/provider-dashboard.repository';
import { ProviderDashboardService } from '@modules/provider-dashboard/services/provider-dashboard.service';

@Module({
    controllers: [],
    providers: [ProviderDashboardService, ProviderDashboardRepository],
    exports: [ProviderDashboardService, ProviderDashboardRepository],
    imports: [],
})
export class ProviderDashboardModule {}
