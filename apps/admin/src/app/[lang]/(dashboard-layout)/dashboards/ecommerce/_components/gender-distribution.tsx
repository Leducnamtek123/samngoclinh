import type { BackofficeOverview } from "@/types"
import type { GenderDistributionType } from "../../analytics/types"

import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { GenderDistributionChart } from "./gender-distribution-chart"

interface SegmentDistributionProps {
  overview?: BackofficeOverview | null
}

export function GenderDistribution({ overview }: SegmentDistributionProps) {
  const totalUsers = overview?.totalUsers || 0
  const totalContracts = overview?.totalContracts || 0
  const retailUsers = Math.max(totalUsers - totalContracts, 0)
  const total = totalUsers || 1

  const data: GenderDistributionType[] = [
    {
      name: "Khách hàng Mua sắm",
      value: retailUsers,
      percentage: +(retailUsers / total),
      fill: "hsl(var(--chart-1))",
      x: 1.5,
      y: 2.5,
    },
    {
      name: "Nhà đầu tư Canh tác",
      value: totalContracts,
      percentage: +(totalContracts / total),
      fill: "hsl(var(--chart-3))",
      x: 3,
      y: 1.5,
    },
  ]

  return (
    <DashboardCard
      title="Phân khúc Thành viên"
      period="Toàn hệ thống"
      className="md:col-span-1 overflow-hidden"
      contentClassName="flex items-center justify-center p-2"
      size="xs"
    >
      <GenderDistributionChart data={data} />
    </DashboardCard>
  )
}
