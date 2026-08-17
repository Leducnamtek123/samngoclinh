import type { BackofficeOverview } from "@/types"
import type { SalesTrendType } from "../types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { SalesTrendChart } from "./sales-trend-chart"

interface SalesTrendProps {
  overview?: BackofficeOverview | null
}

export function SalesTrend({ overview }: SalesTrendProps) {
  const users = overview?.totalUsers || 0
  const contracts = overview?.totalContracts || 0
  const signed = overview?.totalSignedContracts || 0
  const monthly = overview?.monthlyRevenue || []

  const salesTrendData: SalesTrendType = {
    period: "Toàn hệ thống",
    summary: {
      totalLead: users,
      totalProposal: contracts,
      totalNegotiation: Math.max(contracts - signed, 0),
      totalClosed: signed,
    },
    monthly:
      monthly.length > 0
        ? monthly.map((m) => ({
            month: m.month,
            lead: m.visitors || 0,
            proposal: m.conversions || 0,
            negotiation: Math.max(Math.round((m.conversions || 0) * 0.5), 0),
            closed: Math.max(Math.round((m.conversions || 0) * 0.3), 0),
          }))
        : [],
  }

  return (
    <DashboardCard
      title="Tiến Trình Chuyển Đổi & Ký Kết"
      period={salesTrendData.period}
      action={<DashboardCardActionsDropdown />}
      className="col-span-full md:col-span-3"
    >
      <SalesTrendChart data={salesTrendData} />
    </DashboardCard>
  )
}
