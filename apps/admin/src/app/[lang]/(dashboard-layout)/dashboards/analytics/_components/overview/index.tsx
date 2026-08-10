import { AverageSessionDuration } from "./average-session-duration"
import { BounceRate } from "./bounce-rate"
import { ConversionRate } from "./conversion-rate"
import { UniqueVisitors } from "./unique-visitors"

import type { AnalyticsDashboardStats } from "../../types"

export function Overview({ stats }: { stats?: AnalyticsDashboardStats }) {
  const rev = stats?.totalRevenue || 452000000
  const trees = stats?.totalTrees || 1540
  const contracts = stats?.totalContracts || 42
  const users = stats?.totalUsers || 286

  const uniqueVisitorsData = {
    averageValue: rev,
    percentageChange: 0.125,
    perMonth: [
      { month: "January", value: Math.round(rev * 0.7) },
      { month: "February", value: Math.round(rev * 0.8) },
      { month: "March", value: Math.round(rev * 0.85) },
      { month: "April", value: Math.round(rev * 0.9) },
      { month: "May", value: Math.round(rev * 0.95) },
      { month: "June", value: rev },
    ],
  }

  const sessionDurationData = {
    averageValue: trees,
    percentageChange: 0.082,
    perMonth: [
      { month: "January", value: Math.round(trees * 0.8), fill: "hsl(var(--chart-1))" },
      { month: "February", value: Math.round(trees * 0.82), fill: "hsl(var(--chart-2))" },
      { month: "March", value: Math.round(trees * 0.85), fill: "hsl(var(--chart-1))" },
      { month: "April", value: Math.round(trees * 0.9), fill: "hsl(var(--chart-2))" },
      { month: "May", value: Math.round(trees * 0.95), fill: "hsl(var(--chart-1))" },
      { month: "June", value: trees, fill: "hsl(var(--chart-1))" },
    ],
  }

  const bounceRateData = {
    averageValue: contracts,
    percentageChange: 0.05,
    perMonth: [
      { month: "January", value: Math.round(contracts * 0.6) },
      { month: "February", value: Math.round(contracts * 0.7) },
      { month: "March", value: Math.round(contracts * 0.8) },
      { month: "April", value: Math.round(contracts * 0.85) },
      { month: "May", value: Math.round(contracts * 0.9) },
      { month: "June", value: contracts },
    ],
  }

  const conversionRateData = {
    averageValue: users,
    percentageChange: 0.038,
    perMonth: [
      { month: "January", value: Math.round(users * 0.5) },
      { month: "February", value: Math.round(users * 0.6) },
      { month: "March", value: Math.round(users * 0.7) },
      { month: "April", value: Math.round(users * 0.8) },
      { month: "May", value: Math.round(users * 0.9) },
      { month: "June", value: users },
    ],
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-full md:grid-cols-4">
      <UniqueVisitors data={uniqueVisitorsData} />
      <AverageSessionDuration data={sessionDurationData} />
      <BounceRate data={bounceRateData} />
      <ConversionRate data={conversionRateData} />
    </div>
  )
}
