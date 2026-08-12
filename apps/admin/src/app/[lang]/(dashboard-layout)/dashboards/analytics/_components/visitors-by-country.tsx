import type { AnalyticsDashboardStats } from "../types"

import { visitorsByCountryData } from "../_data/visitors-by-country"

import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { VisitorsByCountryList } from "./visitors-by-country-list"

export function VisitorsByCountry({
  stats,
}: {
  stats?: AnalyticsDashboardStats
}) {
  const data = stats?.visitorsByCountry
    ? {
        summary: {
          totalVisitors: stats.visitorsByCountry.reduce(
            (sum: number, c) => sum + c.visitors,
            0
          ),
        },
        countries: stats.visitorsByCountry.map((c) => ({
          countryName: c.country,
          countryCode: c.code.toUpperCase(),
          visitors: c.visitors,
          percentageChange: c.percentageChange,
        })),
      }
    : visitorsByCountryData

  return (
    <DashboardCard title="Phân bố khách hàng theo Quốc gia">
      <VisitorsByCountryList data={data} />
    </DashboardCard>
  )
}
