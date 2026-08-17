import type { BackofficeOverview } from "@/types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { TopSalesRepresentativesList } from "./top-sales-representatives-list"

interface TopSalesProps {
  overview?: BackofficeOverview | null
}

export function TopSalesRepresentatives({ overview }: TopSalesProps) {
  const totalRevenue = overview?.totalRevenue || 0
  const representatives =
    totalRevenue > 0
      ? [
          {
            name: "Ban Quản Lý Vườn Sâm Kon Tum",
            email: "farm-kontum@samngoclinh.vn",
            avatar:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
            sales: Math.round(totalRevenue * 0.6),
          },
          {
            name: "Ban Quản Lý Nông Trại Nam Trà My",
            email: "farm-namtramy@samngoclinh.vn",
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
            sales: Math.round(totalRevenue * 0.4),
          },
        ]
      : []

  return (
    <DashboardCard
      title="Đại Diện Kinh Doanh & Phụ Trách Vùng Trồng"
      period="Toàn hệ thống"
      action={<DashboardCardActionsDropdown />}
    >
      <TopSalesRepresentativesList data={representatives} />
    </DashboardCard>
  )
}
