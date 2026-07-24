"use client"

import type { ChartConfig } from "@/components/ui/chart"
import type { TrafficSourcesType } from "../types"

import { useRadius } from "@/hooks/use-radius"
import { useRecharts } from "@/hooks/use-recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
} satisfies ChartConfig

export function TrafficSourcesChart({
  data,
}: {
  data: TrafficSourcesType["sources"]
}) {
  const recharts = useRecharts()
  const radius = useRadius()
  if (!recharts)
    return (
      <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    )
  const { RadialBar, RadialBarChart } = recharts

  return (
    <ChartContainer config={chartConfig} className="aspect-square h-52 mx-auto">
      <RadialBarChart data={data} innerRadius={30} outerRadius={110}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <RadialBar dataKey="visitors" background cornerRadius={radius} />
      </RadialBarChart>
    </ChartContainer>
  )
}
