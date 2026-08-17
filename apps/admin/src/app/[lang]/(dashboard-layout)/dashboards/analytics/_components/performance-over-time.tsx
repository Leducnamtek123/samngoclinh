import { ChevronDown } from "lucide-react"

import type { AnalyticsDashboardStats } from "../types"

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button-variants"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { PerformanceOverTimeChart } from "./performance-over-time-chart"
import { PerformanceOverTimeSummary } from "./performance-over-time-summary"

function PerformanceOverTimeActionButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "w-24 justify-between [&[data-state=open]>svg]:rotate-180"
        )}
      >
        <span>2024</span>
        <ChevronDown className="h-4 w-4 shrink-0 ms-2 transition-transform duration-200" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-24">
        <DropdownMenuRadioGroup value="2024">
          <DropdownMenuRadioItem value="2024">2024</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="2023">2023</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="2022">2022</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function PerformanceOverTime({
  stats,
}: {
  stats?: AnalyticsDashboardStats
}) {
  const monthlyRevenue = stats?.monthlyRevenue || []
  const summary = {
    totalVisitors: monthlyRevenue.reduce(
      (sum: number, r) =>
        sum +
        Number(
          r.visitors ?? (r as { ordersCount?: number }).ordersCount ?? 0
        ),
      0
    ),
    totalConversions: monthlyRevenue.reduce(
      (sum: number, r) =>
        sum +
        Number(
          r.conversions ?? (r as { treesPlanted?: number }).treesPlanted ?? 0
        ),
      0
    ),
  }

  const performance = monthlyRevenue.map((m) => ({
    month: m.month,
    visitors: Number(
      m.visitors ?? (m as { ordersCount?: number }).ordersCount ?? 0
    ),
    conversions: Number(
      m.conversions ?? (m as { treesPlanted?: number }).treesPlanted ?? 0
    ),
  }))

  return (
    <DashboardCard
      title="Tăng trưởng qua Thời gian"
      action={<PerformanceOverTimeActionButton />}
    >
      <PerformanceOverTimeSummary data={summary} />
      <PerformanceOverTimeChart data={performance} />
    </DashboardCard>
  )
}
