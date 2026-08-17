import type { AnalyticsDashboardStats } from "../types"

import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { NewVsReturningVisitorsChart } from "./new-vs-returning-visitors-chart"
import { NewVsReturningVisitorsList } from "./new-vs-returning-visitors-list"

export function NewVsReturningVisitors({
  stats,
}: {
  stats?: AnalyticsDashboardStats
}) {
  const newCount = stats?.newVsReturning?.summary?.newVisitors || 0
  const returningCount = stats?.newVsReturning?.summary?.returningVisitors || 0
  const total = newCount + returningCount || 1

  const visitors = {
    new: {
      value: newCount,
      percentageChange: +(newCount / total).toFixed(2),
      fill: "hsl(var(--chart-1))",
    },
    returning: {
      value: returningCount,
      percentageChange: +(returningCount / total).toFixed(2),
      fill: "hsl(var(--chart-2))",
    },
  }

  return (
    <DashboardCard
      title="Khách hàng mới vs. Thường niên"
      size="xs"
      contentClassName="gap-y-3"
    >
      <NewVsReturningVisitorsChart data={visitors} />
      <NewVsReturningVisitorsList data={visitors} />
    </DashboardCard>
  )
}
