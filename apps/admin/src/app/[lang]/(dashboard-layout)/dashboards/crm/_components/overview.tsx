import { BadgePercent, FileText, HandCoins, Users } from "lucide-react"

import type { BackofficeOverview } from "@/types"

import {
  DashboardCardActionsDropdown,
  DashboardOverviewCard,
} from "@/components/dashboards/dashboard-card"

interface OverviewProps {
  stats?: BackofficeOverview | null
}

export function Overview({ stats }: OverviewProps) {
  const totalRevenue = stats?.totalRevenue || 0
  const totalContracts = stats?.totalContracts || 0
  const signedContracts = stats?.totalSignedContracts || 0
  const totalUsers = stats?.totalUsers || 0

  const totalSalesData = {
    value: totalRevenue,
    percentageChange: 0.05,
    period: "Toàn hệ thống",
  }

  const contractsData = {
    value: totalContracts,
    percentageChange: 0.05,
    period: "Tổng số",
  }

  const signedContractsData = {
    value: signedContracts,
    percentageChange: 0.05,
    period: "Đã hoàn tất",
  }

  const totalUsersData = {
    value: totalUsers,
    percentageChange: 0.05,
    period: "Toàn bộ",
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2 md:grid-cols-4">
      <DashboardOverviewCard
        data={totalSalesData}
        title="Tổng Doanh Thu Đầu Tư"
        period={totalSalesData.period}
        action={<DashboardCardActionsDropdown />}
        icon={BadgePercent}
        formatStyle="currency"
      />
      <DashboardOverviewCard
        data={contractsData}
        title="Hợp Đồng Khởi Tạo"
        period={contractsData.period}
        action={<DashboardCardActionsDropdown />}
        icon={FileText}
      />
      <DashboardOverviewCard
        data={signedContractsData}
        title="Hợp Đồng Đã Ký"
        period={signedContractsData.period}
        action={<DashboardCardActionsDropdown />}
        icon={HandCoins}
      />
      <DashboardOverviewCard
        data={totalUsersData}
        title="Nhà Đầu Tư & Khách Hàng"
        period={totalUsersData.period}
        action={<DashboardCardActionsDropdown />}
        icon={Users}
      />
    </div>
  )
}
