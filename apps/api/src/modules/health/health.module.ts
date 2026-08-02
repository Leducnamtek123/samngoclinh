import { HealthDatabaseIndicator } from '@modules/health/indicators/health.database.indicator';
import { HealthRedisIndicator } from '@modules/health/indicators/health.redis.indicator';
import { HealthSentryIndicator } from '@modules/health/indicators/health.sentry.indicator';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

/**
 * Wires Terminus and the custom indicators for system health checks.
 */
@Module({
    providers: [
        HealthDatabaseIndicator,
        HealthRedisIndicator,
        HealthSentryIndicator,
    ],
    exports: [
        HealthDatabaseIndicator,
        HealthRedisIndicator,
        HealthSentryIndicator,
        TerminusModule,
    ],
    imports: [
        TerminusModule.forRoot({
            gracefulShutdownTimeoutMs: 30000,
        }),
    ],
})
export class HealthModule {}
