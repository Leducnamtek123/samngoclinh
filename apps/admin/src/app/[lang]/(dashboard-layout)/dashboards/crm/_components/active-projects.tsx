import type { EContract } from "@/types"
import type { ActiveProjectType } from "../types"

import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { ActiveProjectsList } from "./active-projects-list"

interface ActiveProjectsProps {
  contracts?: EContract[] | null
}

export function ActiveProjects({ contracts }: ActiveProjectsProps) {
  const data: ActiveProjectType[] =
    contracts && contracts.length > 0
      ? contracts.slice(0, 5).map((c) => ({
          name:
            c.contractNumber || c.title || `Hợp đồng #${c.id.substring(0, 8)}`,
          progress:
            c.status === "SIGNED" ? 100 : c.status === "ACTIVE" ? 80 : 35,
          startDate: c.createdAt ? new Date(c.createdAt) : new Date(),
          dueDate: c.signedAt
            ? new Date(c.signedAt)
            : new Date(Date.now() + 30 * 86400000),
          status:
            c.status === "SIGNED"
              ? "On Track"
              : c.status === "ACTIVE"
                ? "On Track"
                : "At Risk",
        }))
      : []

  return (
    <DashboardCard title="Tiến Độ Hợp Đồng Canh Tác Sâm" size="lg">
      <ActiveProjectsList data={data} />
    </DashboardCard>
  )
}
