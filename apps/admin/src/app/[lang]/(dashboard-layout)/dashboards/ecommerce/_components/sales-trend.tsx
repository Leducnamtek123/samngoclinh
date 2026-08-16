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

const DEFAULT_SALES_TRENDS = [
  { date: 1, sales: 85000000 },
  { date: 2, sales: 120000000 },
  { date: 3, sales: 145000000 },
  { date: 4, sales: 110000000 },
  { date: 5, sales: 162000000 },
  { date: 6, sales: 195000000 },
]

export function SalesTrend({ monthlyRevenue, totalRevenue = 150000000 }: SalesTrendProps) {
  const trends =
    monthlyRevenue && monthlyRevenue.length > 0
      ? monthlyRevenue.map((m, idx) => ({
          date: idx + 1,
          sales: Math.max(m.visitors * 15000, 50000000),
        }))
      : DEFAULT_SALES_TRENDS

  const salesValues = trends.map((t) => t.sales)
  const lowest = Math.min(...salesValues)
  const highest = Math.max(...salesValues)
  const avg = Math.round(salesValues.reduce((a, b) => a + b, 0) / salesValues.length)
  const total = totalRevenue || salesValues.reduce((a, b) => a + b, 0)

  const summary = {
    lowestSales: { date: trends.find((t) => t.sales === lowest)?.date || 1, sales: lowest },
    highestSales: { date: trends.find((t) => t.sales === highest)?.date || 6, sales: highest },
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
