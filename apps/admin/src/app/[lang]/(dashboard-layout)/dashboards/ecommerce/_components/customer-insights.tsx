import type { BackofficeOverview } from "@/types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { CustomerInsightList } from "./customer-insight-list"

interface CustomerInsightsProps {
  overview?: BackofficeOverview | null
}

export function CustomerInsights({ overview }: CustomerInsightsProps) {
  const total = overview?.totalUsers || 100
  const returning = overview?.newVsReturning?.summary?.returningVisitors
    ? Math.round(overview.newVsReturning.summary.returningVisitors / 120)
    : 35
  const newCust = Math.max(total - returning, 15)
  const vip = Math.round(total * 0.2)

  const data = {
    period: "Toàn hệ thống",
    totalCustomers: total,
    newCustomers: newCust,
    returningCustomers: returning,
    vipCustomers: vip,
  }

  return (
    <DashboardCard
      title="Khách Hàng & Nhà Đầu Tư"
      period={data.period}
      action={<DashboardCardActionsDropdown />}
      size="xs"
      className="md:col-span-3"
      contentClassName="justify-center"
    >
      <CustomerInsightList data={data} />
    </DashboardCard>
  )
}
