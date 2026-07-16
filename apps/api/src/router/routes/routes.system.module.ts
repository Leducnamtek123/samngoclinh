import { FeatureFlagSystemController } from '@modules/feature-flag/controllers/feature-flag.system.controller';
import { HealthSystemController } from '@modules/health/controllers/health.system.controller';
import { HealthModule } from '@modules/health/health.module';
import { ProviderDashboardSystemController } from '@modules/provider-dashboard/controllers/provider-dashboard.system.controller';
import { ProviderDashboardModule } from '@modules/provider-dashboard/provider-dashboard.module';
import { RoleSystemController } from '@modules/role/controllers/role.system.controller';
import { UserSystemController } from '@modules/user/controllers/user.system.controller';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';

/**
 * Mounts system-level controllers (machine-to-machine via API key): user, health,
 * feature flag, and role.
 */
@Module({
    controllers: [
        UserSystemController,
        HealthSystemController,
        FeatureFlagSystemController,
        ProviderDashboardSystemController,
        RoleSystemController,
    ],
    providers: [],
    exports: [],
    imports: [UserModule, HealthModule, ProviderDashboardModule],
})
export class RoutesSystemModule {}
