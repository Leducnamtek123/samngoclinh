"use client"

import type { ChartConfig } from "@/components/ui/chart"
import type { OverviewType } from "../../types"

import { useIsRtl } from "@/hooks/use-is-rtl"
import { useRecharts } from "@/hooks/use-recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "Visitors",
  },
} satisfies ChartConfig

export function UniqueVisitorsChart({
  data,
}: {
  data: OverviewType["uniqueVisitors"]["perMonth"]
}) {
  const recharts = useRecharts()
  const isRtl = useIsRtl()
  if (!recharts)
    return (
      <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    )
  const { Area, AreaChart, CartesianGrid, XAxis } = recharts

  return (
    <ChartContainer
      config={chartConfig}
      className="h-32 w-full rounded-b-md overflow-hidden"
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 0,
          right: 0,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          reversed={isRtl}
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          hide
          tickFormatter={(value: string) =>
            value ? String(value).slice(0, 3) : ""
          }
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="value"
          type="natural"
          fill="hsl(var(--chart-1))"
          fillOpacity={0.4}
          stroke="hsl(var(--chart-1))"
        />
      </AreaChart>
    </ChartContainer>
  )
}
