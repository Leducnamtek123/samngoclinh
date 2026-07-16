import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { IBackofficeOverview } from '@modules/backoffice/interfaces/backoffice.interface';
import { EnumRoleType } from '@generated/prisma-client';

@Injectable()
export class BackofficeRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async getOverview(): Promise<IBackofficeOverview> {
        const domains = ['catalog', 'content', 'promotion', 'marketplace', 'wallet', 'orders', 'cultivation'];

        const pendingKycCount = await this.databaseService.identityVerificationRequest.count({
            where: { status: 'pending' },
        });

        const activeProvidersCount = await this.databaseService.user.count({
            where: {
                status: 'active',
                role: {
                    type: EnumRoleType.provider,
                },
            },
        });

        const articlesCount = await this.databaseService.contentArticle.count();

        return {
            domains,
            totalPendingApprovals: pendingKycCount,
            totalActiveProviders: activeProvidersCount,
            totalArticles: articlesCount,
        };
    }
}
