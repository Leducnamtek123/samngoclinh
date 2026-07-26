import { engagementByDeviceData } from "../_data/engagement-by-device"

import { EngagementByDeviceTable } from "./engagement-by-device-table"

export function EngagementByDevice({ stats }: { stats: any }) {
  const data = stats?.engagementByDevice || engagementByDeviceData

  return (
    <article className="col-span-full">
      <EngagementByDeviceTable data={data} />
    </article>
  )
}
