import type { BackofficeOverview } from "@/types"

import { Card } from "@/components/ui/card"
import { RevenueTrendChart } from "./revenue-trend-chart"
import { RevenueTrendSummary } from "./revenue-trend-summary"

interface RevenueTrendProps {
  overview?: BackofficeOverview | null
}

export function RevenueTrend({ overview }: RevenueTrendProps) {
  const rev = overview?.totalRevenue || 0
  const monthly = overview?.monthlyRevenue || []

  const summary = {
    totalRevenue: rev,
    totalPercentageChange: 0.05,
  }

  const revenueTrends =
    monthly.length > 0
      ? monthly.map((m) => ({
          month: m.month,
          revenue: m.visitors ? Math.round(m.visitors * 10000) : 0,
        }))
      : []

  return (
    <Card className="h-56 flex flex-col justify-between gap-y-6 p-6">
      <RevenueTrendSummary data={summary} />
      <RevenueTrendChart data={revenueTrends} />
    </Card>
  )
}
