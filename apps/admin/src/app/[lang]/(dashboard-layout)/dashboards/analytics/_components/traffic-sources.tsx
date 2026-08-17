import type { AnalyticsDashboardStats } from "../types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { TrafficSourcesChart } from "./traffic-sources-chart"
import { TrafficSourcesTable } from "./traffic-sources-table"

export function TrafficSources({ stats }: { stats?: AnalyticsDashboardStats }) {
  const sources = (stats?.trafficSources || []).map((s) => ({
    name: s.name,
    visitors: Number(s.visitors ?? (s as { count?: number }).count ?? 0),
    fill: s.fill || "hsl(var(--chart-1))",
    percentageChange: Number(s.percentageChange ?? 0),
    icon: s.icon || "Globe",
  }))

  return (
    <DashboardCard
      title="Kênh Phân phối Sâm"
      period="Toàn hệ thống"
      action={<DashboardCardActionsDropdown />}
      size="lg"
    >
      <TrafficSourcesChart data={sources} />
      <TrafficSourcesTable data={sources} />
    </DashboardCard>
  )
}
