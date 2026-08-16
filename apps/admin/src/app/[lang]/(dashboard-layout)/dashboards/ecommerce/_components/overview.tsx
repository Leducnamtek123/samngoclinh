import { BadgePercent, HandCoins, ShoppingBag, TrendingUp } from "lucide-react"

import type { BackofficeOverview } from "@/types"

import {
  DashboardCardActionsDropdown,
  DashboardOverviewCardV2,
} from "@/components/dashboards/dashboard-card"

interface OverviewProps {
  stats?: BackofficeOverview | null
}

export function Overview({ stats }: OverviewProps) {
  const totalRevenue = stats?.totalRevenue ?? 150000000
  const totalOrders = stats?.totalOrders ?? 45
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  const totalSalesData = {
    value: totalRevenue,
    percentageChange: 0.18,
    period: "Tháng này",
  }

  const revenueSummaryData = {
    value: totalRevenue,
    percentageChange: 0.15,
    period: "Toàn bộ",
  }

  const numberOfOrdersData = {
    value: totalOrders,
    percentageChange: 0.12,
    period: "Tháng này",
  }

  const avgOrderValueData = {
    value: avgOrderValue,
    percentageChange: 0.05,
    period: "Trung bình",
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2 md:grid-cols-4">
      <DashboardOverviewCardV2
        data={totalSalesData}
        title="Tổng Doanh Thu"
        period={totalSalesData.period}
        action={<DashboardCardActionsDropdown />}
        icon={BadgePercent}
        formatStyle="currency"
      />
      <DashboardOverviewCardV2
        data={revenueSummaryData}
        title="Doanh Số Canh Tác & Bán Hàng"
        period={revenueSummaryData.period}
        action={<DashboardCardActionsDropdown />}
        icon={HandCoins}
        formatStyle="currency"
      />
      <DashboardOverviewCardV2
        data={numberOfOrdersData}
        title="Số Lượng Đơn Hàng"
        period={numberOfOrdersData.period}
        action={<DashboardCardActionsDropdown />}
        icon={ShoppingBag}
      />
      <DashboardOverviewCardV2
        data={avgOrderValueData}
        title="Giá Trị Đơn Trung Bình"
        period={avgOrderValueData.period}
        action={<DashboardCardActionsDropdown />}
        icon={TrendingUp}
        formatStyle="currency"
      />
    </div>
  )
}
