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

const DEFAULT_SOURCES = [
  { name: "Vườn liên kết", value: 65000000, percentage: 43.3, fill: "hsl(var(--chart-1))" },
  { name: "Đại lý phân phối", value: 38000000, percentage: 25.3, fill: "hsl(var(--chart-2))" },
  { name: "Đơn hàng Online", value: 24000000, percentage: 16.0, fill: "hsl(var(--chart-3))" },
  { name: "Khách ký gửi tự do", value: 15000000, percentage: 10.0, fill: "hsl(var(--chart-4))" },
  { name: "Hợp đồng doanh nghiệp", value: 8000000, percentage: 5.4, fill: "hsl(var(--chart-5))" },
]

export function RevenueBySource({ sources, totalRevenue = 150000000 }: RevenueBySourceProps) {
  const sumRevenue = totalRevenue || 150000000

  const formattedSources =
    sources && sources.length > 0
      ? sources.map((s) => {
          const val = Math.round((s.visitors / 10000) * sumRevenue) || 15000000
          const pct = Math.round((val / (sumRevenue || 1)) * 1000) / 10
          return {
            name: s.name,
            value: val,
            percentage: pct,
            fill: s.fill,
          }
        })
      : DEFAULT_SOURCES

  const summary = {
    totalRevenue: sumRevenue,
    percentageChange: 0.18,
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
