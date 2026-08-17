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
        (sum: number, c) =>
          sum + Number(c.visitors ?? (c as { count?: number }).count ?? 0),
        0
      ),
    },
    countries: visitorsByCountry.map((c) => ({
      countryName: c.country,
      countryCode: (c.code || "VN").toUpperCase(),
      visitors: Number(c.visitors ?? (c as { count?: number }).count ?? 0),
      percentageChange: Number(c.percentageChange ?? 0),
    })),
  }

  return (
    <DashboardCard title="Phân bố khách hàng theo Quốc gia">
      <VisitorsByCountryList data={data} />
    </DashboardCard>
  )
}
