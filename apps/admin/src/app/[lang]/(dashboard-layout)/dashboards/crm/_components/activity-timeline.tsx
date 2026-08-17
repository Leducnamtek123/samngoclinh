import type { ContactRequest } from "@/types"
import type { ActivityTimelineType } from "../types"

import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { ActivityTimelineList } from "./activity-timeline-list"

interface ActivityTimelineProps {
  contacts?: ContactRequest[] | null
}

export function ActivityTimeline({ contacts }: ActivityTimelineProps) {
  const activities: ActivityTimelineType["activities"] =
    contacts && contacts.length > 0
      ? contacts.slice(0, 4).map((c) => ({
          type: "note" as const,
          iconName: "FileText" as const,
          fill: "hsl(var(--chart-1))",
          title: `Yêu cầu tư vấn: ${c.subject || "Quan tâm đầu tư Sâm Ngọc Linh"}`,
          description: `Khách hàng: ${c.fullName || "Khách hàng"} - SĐT/Email: ${c.phoneNumber || c.phone || c.email || "Liên hệ"}. Ghi chú: ${c.message || "Không có"}`,
          status: c.status || "Chờ liên hệ",
          date: c.createdAt || new Date().toISOString(),
          assignedMembers: [],
        }))
      : []

  return (
    <DashboardCard
      title="Nhật Ký Yêu Cầu Tư Vấn & Chăm Sóc"
      period="Gần nhất"
      size="lg"
      contentClassName="pb-0"
    >
      <ActivityTimelineList data={activities} />
    </DashboardCard>
  )
}
