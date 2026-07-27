import { AverageSessionDuration } from "./average-session-duration"
import { BounceRate } from "./bounce-rate"
import { ConversionRate } from "./conversion-rate"
import { UniqueVisitors } from "./unique-visitors"

export function Overview({ stats }: { stats: any }) {
  const uniqueVisitorsData = {
    averageValue: stats.totalRevenue || 452000000,
    percentageChange: 0.125,
    perMonth: [
      {
        month: "January",
        value: Math.round((stats.totalRevenue || 452000000) * 0.7),
      },
      {
        month: "February",
        value: Math.round((stats.totalRevenue || 452000000) * 0.8),
      },
      {
        month: "March",
        value: Math.round((stats.totalRevenue || 452000000) * 0.85),
      },
      {
        month: "April",
        value: Math.round((stats.totalRevenue || 452000000) * 0.9),
      },
      {
        month: "May",
        value: Math.round((stats.totalRevenue || 452000000) * 0.95),
      },
      { month: "June", value: stats.totalRevenue || 452000000 },
    ],
  }

  const sessionDurationData = {
    averageValue: stats.totalTrees || 1540,
    percentageChange: 0.082,
    perMonth: [
      {
        month: "January",
        value: Math.round((stats.totalTrees || 1540) * 0.8),
        fill: "hsl(var(--chart-1))",
      },
      {
        month: "February",
        value: Math.round((stats.totalTrees || 1540) * 0.82),
        fill: "hsl(var(--chart-2))",
      },
      {
        month: "March",
        value: Math.round((stats.totalTrees || 1540) * 0.85),
        fill: "hsl(var(--chart-1))",
      },
      {
        month: "April",
        value: Math.round((stats.totalTrees || 1540) * 0.9),
        fill: "hsl(var(--chart-2))",
      },
      {
        month: "May",
        value: Math.round((stats.totalTrees || 1540) * 0.95),
        fill: "hsl(var(--chart-1))",
      },
      {
        month: "June",
        value: stats.totalTrees || 1540,
        fill: "hsl(var(--chart-1))",
      },
    ],
  }

  const bounceRateData = {
    averageValue: stats.totalContracts || 42,
    percentageChange: 0.05,
    perMonth: [
      {
        month: "January",
        value: Math.round((stats.totalContracts || 42) * 0.6),
      },
      {
        month: "February",
        value: Math.round((stats.totalContracts || 42) * 0.7),
      },
      { month: "March", value: Math.round((stats.totalContracts || 42) * 0.8) },
      {
        month: "April",
        value: Math.round((stats.totalContracts || 42) * 0.85),
      },
      { month: "May", value: Math.round((stats.totalContracts || 42) * 0.9) },
      { month: "June", value: stats.totalContracts || 42 },
    ],
  }

  const conversionRateData = {
    averageValue: stats.totalUsers || 286,
    percentageChange: 0.038,
    perMonth: [
      { month: "January", value: Math.round((stats.totalUsers || 286) * 0.5) },
      { month: "February", value: Math.round((stats.totalUsers || 286) * 0.6) },
      { month: "March", value: Math.round((stats.totalUsers || 286) * 0.7) },
      { month: "April", value: Math.round((stats.totalUsers || 286) * 0.8) },
      { month: "May", value: Math.round((stats.totalUsers || 286) * 0.9) },
      { month: "June", value: stats.totalUsers || 286 },
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
