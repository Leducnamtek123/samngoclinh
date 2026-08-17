import type { TrafficSourceData } from "@/types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { RevenueBySourceChart } from "./revenue-by-source-chart"
import { RevenueBySourceList } from "./revenue-by-source-list"
import { RevenueBySourceSummary } from "./revenue-by-source-summary"

interface RevenueBySourceProps {
  sources?: TrafficSourceData[]
  totalRevenue?: number
}

export function RevenueBySource({ sources, totalRevenue = 0 }: RevenueBySourceProps) {
  const sumRevenue = totalRevenue || 0

  const formattedSources =
    sources && sources.length > 0
      ? sources.map((s) => {
          const val = Math.round((s.visitors / 10000) * (sumRevenue || 1))
          const pct = Math.round((val / (sumRevenue || 1)) * 1000) / 10
          return {
            name: s.name,
            value: val,
            percentage: pct,
            fill: s.fill,
          }
        })
      : []

  const summary = {
    totalRevenue: sumRevenue,
    percentageChange: 0.05,
  }

  return (
    <DashboardCard
      title="Doanh Thu Theo Kênh Phân Phối"
      period="Toàn bộ"
      action={<DashboardCardActionsDropdown />}
      size="sm"
      contentClassName="gap-y-3"
    >
      <RevenueBySourceSummary data={summary} />
      <RevenueBySourceChart data={formattedSources} />
      <RevenueBySourceList data={formattedSources} />
    </DashboardCard>
  )
}
