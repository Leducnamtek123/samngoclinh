export interface IBackofficeOverview {
    domains: string[];
    totalPendingApprovals: number;
    totalActiveProviders: number;
    totalArticles: number;
    totalGardens: number;
    totalBeds: number;
    totalTrees: number;
    totalOrders: number;
    totalRevenue: number;
    totalContracts: number;
    totalSignedContracts: number;
    totalUsers: number;
    monthlyRevenue?: any[];
    trafficSources?: any[];
    newVsReturning?: any;
    visitorsByCountry?: any[];
    engagementByDevice?: any[];
}
