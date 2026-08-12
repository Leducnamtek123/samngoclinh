import type { AnalyticsDashboardStats } from "../types"

import { newVsReturningVisitors } from "../_data/new-vs-returning-visitors"

import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { NewVsReturningVisitorsChart } from "./new-vs-returning-visitors-chart"
import { NewVsReturningVisitorsList } from "./new-vs-returning-visitors-list"

export function NewVsReturningVisitors({
  stats,
}: {
  stats?: AnalyticsDashboardStats
}) {
  const visitors = stats?.newVsReturning
    ? {
        new: {
          value: stats.newVsReturning.summary.newVisitors,
          percentageChange: 0.65,
          fill: "hsl(var(--chart-1))",
        },
        returning: {
          value: stats.newVsReturning.summary.returningVisitors,
          percentageChange: 0.35,
          fill: "hsl(var(--chart-2))",
        },
      }
    : newVsReturningVisitors.visitors

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
