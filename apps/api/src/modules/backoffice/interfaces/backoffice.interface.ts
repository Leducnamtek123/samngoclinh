export interface IBackofficeMonthlyRevenue {
    month: string;
    visitors?: number;
    conversions?: number;
    revenue?: number;
    ordersCount?: number;
    treesPlanted?: number;
}

export interface IBackofficeTrafficSource {
    name: string;
    visitors?: number;
    count?: number;
    fill: string;
    percentageChange?: number;
    icon: string;
}

export interface IBackofficeNewVsReturningData {
    month: string;
    new?: number;
    returning?: number;
    orders?: number;
    trees?: number;
}

export interface IBackofficeNewVsReturning {
    summary: {
        newVisitors?: number;
        returningVisitors?: number;
        singleOrderUsers?: number;
        returningUsers?: number;
        totalRegisteredUsers?: number;
    };
    data: IBackofficeNewVsReturningData[];
}

export interface IBackofficeVisitorsByCountry {
    country: string;
    code: string;
    visitors?: number;
    count?: number;
    fill: string;
    percentageChange?: number;
}

export interface IBackofficeEngagementByDevice {
    id: string;
    device: string;
    sessions?: number;
    count?: number;
    bounceRate?: string;
    sessionDuration?: string;
}

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
    monthlyRevenue?: IBackofficeMonthlyRevenue[];
    trafficSources?: IBackofficeTrafficSource[];
    newVsReturning?: IBackofficeNewVsReturning;
    visitorsByCountry?: IBackofficeVisitorsByCountry[];
    engagementByDevice?: IBackofficeEngagementByDevice[];
}
