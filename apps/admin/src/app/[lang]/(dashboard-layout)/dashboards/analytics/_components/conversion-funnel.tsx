import type { BackofficeOverview } from "@/types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { ConversionFunnelChart } from "./conversion-funnel-chart"
import { ConversionFunnelList } from "./conversion-funnel-list"

export function ConversionFunnel({ stats }: { stats?: BackofficeOverview | null }) {
  const users = stats?.totalUsers || 0
  const orders = stats?.totalOrders || 0
  const contracts = stats?.totalContracts || 0
  const signedContracts = stats?.totalSignedContracts || 0

  const funnelSteps = [
    {
      name: "Tài khoản thành viên",
      value: users,
    },
    {
      name: "Đơn đặt hàng sản phẩm",
      value: orders,
    },
    {
      name: "Hợp đồng khởi tạo",
      value: contracts,
    },
    {
      name: "Hợp đồng đã ký kết",
      value: signedContracts,
    },
  ]

  return (
    <DashboardCard
      title="Phễu Mua hàng & Ký kết"
      period="Toàn hệ thống"
      action={<DashboardCardActionsDropdown />}
      className="overflow-hidden"
      contentClassName="p-0"
      size="sm"
    >
      <ConversionFunnelList data={funnelSteps} />
      <ConversionFunnelChart data={funnelSteps} />
    </DashboardCard>
  )
}
