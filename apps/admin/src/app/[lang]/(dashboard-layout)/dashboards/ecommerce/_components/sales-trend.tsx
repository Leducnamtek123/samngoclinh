import type { MonthlyRevenueData } from "@/types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { SalesTrendChart } from "./sales-trend-chart"
import { SalesTrendSummary } from "./sales-trend-summary"

interface SalesTrendProps {
  monthlyRevenue?: MonthlyRevenueData[]
  totalRevenue?: number
}

export function SalesTrend({
  monthlyRevenue,
  totalRevenue = 0,
}: SalesTrendProps) {
  const trends =
    monthlyRevenue && monthlyRevenue.length > 0
      ? monthlyRevenue.map((m, idx) => ({
          date: m.month || `Tháng ${idx + 1}`,
          sales: m.visitors ? Math.round(m.visitors * 10000) : 0,
        }))
      : []

  const salesValues = trends.map((t) => t.sales)
  const lowest = salesValues.length > 0 ? Math.min(...salesValues) : 0
  const highest = salesValues.length > 0 ? Math.max(...salesValues) : 0
  const avg =
    salesValues.length > 0
      ? Math.round(salesValues.reduce((a, b) => a + b, 0) / salesValues.length)
      : 0
  const total =
    totalRevenue ||
    (salesValues.length > 0 ? salesValues.reduce((a, b) => a + b, 0) : 0)

  const summary = {
    lowestSales: {
      date: trends.find((t) => t.sales === lowest)?.date || "Tháng 1",
      sales: lowest,
    },
    highestSales: {
      date: trends.find((t) => t.sales === highest)?.date || "Tháng 6",
      sales: highest,
    },
    avgSales: avg,
    totalSales: total,
  }

  return (
    <DashboardCard
      title="Xu Hướng Bán Hàng & Canh Tác Sâm"
      period="6 tháng gần nhất"
      action={<DashboardCardActionsDropdown />}
      size="default"
    >
      <SalesTrendSummary data={summary} />
      <SalesTrendChart data={trends} />
    </DashboardCard>
  )
}
