import type { AnalyticsDashboardStats } from "../types"

import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { VisitorsByCountryList } from "./visitors-by-country-list"

export function VisitorsByCountry({
  stats,
}: {
  stats?: AnalyticsDashboardStats
}) {
  const visitorsByCountry = stats?.visitorsByCountry || []
  const data = {
    summary: {
      totalVisitors: visitorsByCountry.reduce(
        (sum: number, c) => sum + (c.visitors || 0),
        0
      ),
    },
    countries: visitorsByCountry.map((c) => ({
      countryName: c.country,
      countryCode: (c.code || "VN").toUpperCase(),
      visitors: c.visitors,
      percentageChange: c.percentageChange,
    })),
  }

  return (
    <DashboardCard title="Phân bố khách hàng theo Quốc gia">
      <VisitorsByCountryList data={data} />
    </DashboardCard>
  )
}
