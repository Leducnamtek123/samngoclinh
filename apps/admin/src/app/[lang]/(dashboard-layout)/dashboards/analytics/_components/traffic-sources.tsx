import { trafficSourcesData } from "../_data/traffic-sources"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { TrafficSourcesChart } from "./traffic-sources-chart"
import { TrafficSourcesTable } from "./traffic-sources-table"

export function TrafficSources({ stats }: { stats: any }) {
  const sources = stats?.trafficSources || trafficSourcesData.sources

  return (
    <DashboardCard
      title="Kênh Phân phối Sâm"
      period={trafficSourcesData.period}
      action={<DashboardCardActionsDropdown />}
      size="lg"
    >
      <TrafficSourcesChart data={sources} />
      <TrafficSourcesTable data={sources} />
    </DashboardCard>
  )
}
