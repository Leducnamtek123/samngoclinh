import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { IBackofficeOverview } from '@modules/backoffice/interfaces/backoffice.interface';

@Injectable()
export class BackofficeRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async getOverview(): Promise<IBackofficeOverview> {
        const domains = [
            'catalog',
            'content',
            'promotion',
            'marketplace',
            'wallet',
            'orders',
            'cultivation',
        ];

        try {
            const activeProvidersCount = 0;

            const articlesCount = await this.databaseService.contentArticle.count().catch(() => 0);

            const totalGardens = await this.databaseService.cultivationGarden.count().catch(() => 0);
            const totalBeds = await this.databaseService.cultivationBed.count().catch(() => 0);
            const totalTreesAgg = await this.databaseService.cultivationTree.aggregate({
                _sum: {
                    quantity: true,
                },
            }).catch(() => ({ _sum: { quantity: 0 } }));
            const totalTrees = totalTreesAgg._sum.quantity ?? 0;

            const totalOrders = await this.databaseService.order.count().catch(() => 0);
            const totalRevenueAgg = await this.databaseService.order.aggregate({
                where: { NOT: { status: 'cancelled' } },
                _sum: {
                    total: true,
                },
            }).catch(() => ({ _sum: { total: 0 } }));
            const totalRevenue = totalRevenueAgg._sum.total ?? 0;

            const totalContracts = await this.databaseService.eContract.count().catch(() => 0);
            const totalSignedContracts = await this.databaseService.eContract.count({
                where: { status: 'signed' },
            }).catch(() => 0);

            const totalUsers = await this.databaseService.user.count().catch(() => 0);

            // 1. Monthly growth
            const monthlyRevenue = [];
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const now = new Date();
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const mName = monthNames[d.getMonth()];
                
                const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
                const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
                
                const ordersInMonth = await this.databaseService.order.findMany({
                    where: {
                        createdAt: {
                            gte: startOfMonth,
                            lte: endOfMonth
                        },
                        NOT: { status: 'cancelled' }
                    },
                    select: {
                        total: true
                    }
                }).catch(() => []);
                
                const monthTotal = ordersInMonth.reduce((sum, o) => sum + o.total, 0);
                
                const treesInMonthAgg = await this.databaseService.cultivationTree.aggregate({
                    where: {
                        createdAt: {
                            gte: startOfMonth,
                            lte: endOfMonth
                        }
                    },
                    _sum: {
                        quantity: true
                    }
                }).catch(() => ({ _sum: { quantity: 0 } }));
                const treesPlanted = treesInMonthAgg._sum.quantity ?? 0;
                
                monthlyRevenue.push({
                    month: mName,
                    revenue: monthTotal,
                    ordersCount: ordersInMonth.length,
                    treesPlanted,
                    visitors: ordersInMonth.length,
                    conversions: treesPlanted,
                });
            }

            // 2. Channel & Source metrics based on real database records
            const activeBedsCount = await this.databaseService.cultivationBed.count({ where: { status: 'active' } }).catch(() => 0);
            const goldProfilesCount = await this.databaseService.businessProfile.count({ where: { rank: 'Gold' } }).catch(() => 0);
            const onlineOrdersCount = await this.databaseService.order.count({ where: { status: 'completed' } }).catch(() => 0);
            const freeGinsengCount = await this.databaseService.cultivationTree.count({ where: { NOT: { carePackageCode: null } } }).catch(() => 0);
            const businessContractsCount = await this.databaseService.eContract.count().catch(() => 0);

            const trafficSources = [
                { name: "Vườn canh tác hoạt động", count: activeBedsCount, visitors: activeBedsCount, percentageChange: 0, fill: "hsl(var(--chart-1))", icon: "Sprout" },
                { name: "Đại lý Gold", count: goldProfilesCount, visitors: goldProfilesCount, percentageChange: 0, fill: "hsl(var(--chart-2))", icon: "Home" },
                { name: "Đơn hàng hoàn tất", count: onlineOrdersCount, visitors: onlineOrdersCount, percentageChange: 0, fill: "hsl(var(--chart-3))", icon: "ShoppingBag" },
                { name: "Cây có gói chăm sóc", count: freeGinsengCount, visitors: freeGinsengCount, percentageChange: 0, fill: "hsl(var(--chart-4))", icon: "User" },
                { name: "Hợp đồng điện tử", count: businessContractsCount, visitors: businessContractsCount, percentageChange: 0, fill: "hsl(var(--chart-5))", icon: "FileCheck" }
            ];

            // 3. User distribution (Orders vs Returning)
            const allOrders = await this.databaseService.order.findMany({ select: { userId: true } }).catch(() => []);
            const orderCounts: Record<string, number> = {};
            for (const o of allOrders) {
                orderCounts[o.userId] = (orderCounts[o.userId] || 0) + 1;
            }
            const returningUsersCount = Object.keys(orderCounts).filter(u => orderCounts[u] > 1).length;
            const singleOrderUsersCount = Object.keys(orderCounts).filter(u => orderCounts[u] === 1).length;

            const newVsReturning = {
                summary: {
                    newVisitors: singleOrderUsersCount,
                    returningVisitors: returningUsersCount,
                    singleOrderUsers: singleOrderUsersCount,
                    returningUsers: returningUsersCount,
                    totalRegisteredUsers: totalUsers,
                },
                data: monthlyRevenue.map(m => ({
                    month: m.month,
                    orders: m.ordersCount,
                    trees: m.treesPlanted,
                    new: m.ordersCount,
                    returning: m.treesPlanted,
                }))
            };

            // 4. Distribution by Country
            const countriesGroup = await this.databaseService.user.groupBy({
                by: ['countryId'],
                _count: {
                    id: true
                }
            }).catch(() => []);
            
            const visitorsByCountry = [];
            for (const item of countriesGroup) {
                if (!item.countryId) {continue;}
                const country = await this.databaseService.country.findUnique({
                    where: { id: item.countryId }
                }).catch(() => null);
                if (country) {
                    visitorsByCountry.push({
                        country: country.name,
                        code: country.alpha2Code.toLowerCase(),
                        count: item._count.id,
                        visitors: item._count.id,
                        percentageChange: 0,
                        fill: "hsl(var(--chart-1))",
                    });
                }
            }

            // 5. Active Sessions by Platform
            const totalSessions = await this.databaseService.session.count().catch(() => 0);
            const totalDevices = await this.databaseService.device.count().catch(() => 0);
            const engagementByDevice = [
                { id: "1", device: "Active User Sessions", count: totalSessions, sessions: totalSessions },
                { id: "2", device: "Registered Devices", count: totalDevices, sessions: totalDevices },
            ];

            return {
                domains,
                totalPendingApprovals: 0,
                totalActiveProviders: activeProvidersCount,
                totalArticles: articlesCount,
                totalGardens,
                totalBeds,
                totalTrees,
                totalOrders,
                totalRevenue,
                totalContracts,
                totalSignedContracts,
                totalUsers,
                monthlyRevenue,
                trafficSources,
                newVsReturning,
                visitorsByCountry,
                engagementByDevice
            };
        } catch (e) {
            return {
                domains,
                totalPendingApprovals: 0,
                totalActiveProviders: 0,
                totalArticles: 0,
                totalGardens: 0,
                totalBeds: 0,
                totalTrees: 0,
                totalOrders: 0,
                totalRevenue: 0,
                totalContracts: 0,
                totalSignedContracts: 0,
                totalUsers: 0,
                monthlyRevenue: [],
                trafficSources: [],
                newVsReturning: { summary: { newVisitors: 0, returningVisitors: 0 }, data: [] },
                visitorsByCountry: [],
                engagementByDevice: []
            };
        }
    }
}
