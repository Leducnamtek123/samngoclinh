export interface MonthlyRevenueData {
  month: string
  visitors: number
  conversions: number
}

export interface TrafficSourceData {
  name: string
  visitors: number
  fill: string
  percentageChange: number
  icon?: string
}

export interface NewVsReturningData {
  summary: {
    newVisitors: number
    returningVisitors: number
  }
  data: Array<{
    month: string
    new: number
    returning: number
  }>
}

export interface VisitorsByCountryData {
  country: string
  code: string
  visitors: number
  fill: string
  percentageChange: number
}

export interface EngagementByDeviceData {
  id?: string
  device?: string
  deviceType?: string
  sessions?: number
  bounceRate?: string | number
  sessionDuration?: string | number
  pagesPerSession?: number
  userPercentage?: number
  conversionRate?: number
}

export interface BackofficeOverview {
  domains: string[]
  totalPendingApprovals: number
  totalActiveProviders: number
  totalArticles: number
  totalGardens: number
  totalBeds: number
  totalTrees: number
  totalOrders: number
  totalRevenue: number
  totalContracts: number
  totalSignedContracts: number
  totalUsers: number
  monthlyRevenue?: MonthlyRevenueData[]
  trafficSources?: TrafficSourceData[]
  newVsReturning?: NewVsReturningData
  visitorsByCountry?: VisitorsByCountryData[]
  engagementByDevice?: EngagementByDeviceData[]
}
