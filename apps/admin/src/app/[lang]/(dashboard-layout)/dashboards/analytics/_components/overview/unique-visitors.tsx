import type { OverviewType } from "../../types"

import {
  DashboardCardActionsDropdown,
  DashboardOverviewCardV3,
} from "@/components/dashboards/dashboard-card"
import { UniqueVisitorsChart } from "./unique-visitors-chart"

export function UniqueVisitors({
  data,
}: {
  data: OverviewType["uniqueVisitors"]
}) {
  return (
    <DashboardOverviewCardV3
      data={{
        value: data.averageValue,
        percentageChange: data.percentageChange,
      }}
      title="Doanh thu sâm (VND)"
      action={<DashboardCardActionsDropdown />}
      chart={<UniqueVisitorsChart data={data.perMonth} />}
      formatStyle="currency"
    />
  )
}
