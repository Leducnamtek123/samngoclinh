import type { BackofficeOverview } from "@/types"
import type { EngagementByDeviceType } from "../types"

import { EngagementByDeviceTable } from "./engagement-by-device-table"

export function EngagementByDevice({
  stats,
}: {
  stats?: BackofficeOverview | null
}) {
  const data: EngagementByDeviceType[] = stats?.engagementByDevice
    ? stats.engagementByDevice.map((d) => ({
        deviceType: d.device || d.deviceType || "Khác",
        sessionDuration:
          typeof d.sessionDuration === "number" ? d.sessionDuration : 180,
        pagesPerSession: d.pagesPerSession || 3.2,
        bounceRate: typeof d.bounceRate === "number" ? d.bounceRate : 0.35,
        userPercentage: d.userPercentage || 0.25,
        conversionRate: d.conversionRate || 0.05,
      }))
    : []

  return (
    <article className="col-span-full">
      <EngagementByDeviceTable data={data} />
    </article>
  )
}
