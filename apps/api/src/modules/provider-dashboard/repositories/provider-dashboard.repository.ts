import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { IProviderDashboardOverview } from '@modules/provider-dashboard/interfaces/provider-dashboard.interface';

@Injectable()
export class ProviderDashboardRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async getOverview(userId: string): Promise<IProviderDashboardOverview> {
        const treeAgg = await this.databaseService.cultivationTree.aggregate({
            where: { ownerUserId: userId },
            _sum: {
                quantity: true,
            },
        });

        const kycCount =
            await this.databaseService.identityVerificationRequest.count({
                where: { status: 'pending' },
            });

        const gardensCount = await this.databaseService.cultivationGarden.count(
            {
                where: { ownerUserId: userId },
            }
        );

        const bedsCount = await this.databaseService.cultivationBed.count({
            where: { ownerUserId: userId },
        });

        const ordersCount = await this.databaseService.order.count({
            where: { userId },
        });

        const orderAgg = await this.databaseService.order.aggregate({
            where: { userId, NOT: { status: 'cancelled' } },
            _sum: {
                total: true,
            },
        });

        return {
            plantsOnHand: treeAgg._sum.quantity ?? 0,
            pendingApprovals: kycCount,
            gardens: gardensCount,
            beds: bedsCount,
            relatedOrders: ordersCount,
            revenue: orderAgg._sum.total ?? 0,
        };
    }
}
