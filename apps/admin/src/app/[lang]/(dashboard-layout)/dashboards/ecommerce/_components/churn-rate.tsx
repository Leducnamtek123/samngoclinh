import type { BackofficeOverview } from "@/types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { ChurnRateChart } from "./churn-rate-chart"
import { ChurnRateSummary } from "./churn-rate-summary"

interface ChurnRateProps {
  overview?: BackofficeOverview | null
}

export function ChurnRate({ overview }: ChurnRateProps) {
  const total = overview?.totalUsers || 0
  const lost = Math.max(Math.round(total * 0.05), 0)
  const churnRate = total > 0 ? +(lost / total).toFixed(3) : 0

  const summary = {
    totalCustomers: total,
    totalLostCustomers: lost,
    averageChurnRate: churnRate,
  }

  const months =
    overview?.monthlyRevenue && overview.monthlyRevenue.length > 0
      ? overview.monthlyRevenue.map((m) => {
          const visitors = m.visitors || 0
          const lostCount = Math.round(visitors * 0.05)
          return {
            month: m.month,
            totalCustomers: visitors,
            lostCustomers: lostCount,
            churnRate: visitors > 0 ? +(lostCount / visitors).toFixed(2) : 0,
          }
        })
      : []

  return (
    <DashboardCard
      title="Tỷ lệ Rời bỏ & Duy trì"
      period="Toàn hệ thống"
      action={<DashboardCardActionsDropdown />}
      size="sm"
    >
      <ChurnRateSummary data={summary} />
      <ChurnRateChart data={months} />
    </DashboardCard>
  )
}
