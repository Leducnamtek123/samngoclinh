"use client"

import type { ComponentProps } from "react"
import type { GenderDistributionType } from "../../analytics/types"

import { formatPercent } from "@/lib/utils"

import { useRecharts } from "@/hooks/use-recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

function ModifiedChartTooltipContent(
  props: ComponentProps<typeof ChartTooltipContent>
) {
  if (!props.payload || props.payload.length === 0) return null

  const item = props.payload[0]

  return (
    <ChartTooltipContent
      {...props}
      payload={[
        {
          ...item,
          name: item.name,
          value: `${item.value} (${formatPercent(Number(item.payload?.percentage || 0))})`,
        },
      ]}
    />
  )
}

export function GenderDistributionChart({
  data,
}: {
  data: GenderDistributionType[]
}) {
  const recharts = useRecharts()
  if (!recharts)
    return (
      <div className="h-[200px] w-full flex items-center justify-center text-muted-foreground text-sm">
        Đang tải...
      </div>
    )
  const { Pie, PieChart, Cell } = recharts

  const chartData = data.map((item) => ({
    name: item.name,
    value: item.value || 1,
    percentage: item.percentage,
    fill: item.fill,
  }))

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 p-2">
      <ChartContainer
        config={{}}
        className="aspect-square h-36 w-36 mx-auto"
      >
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <ChartTooltip
            cursor={false}
            content={<ModifiedChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={55}
            paddingAngle={3}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="w-full grid grid-cols-1 gap-1 text-xs px-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-1.5 truncate">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-muted-foreground truncate">{item.name}</span>
            </div>
            <span className="font-semibold shrink-0">
              {formatPercent(item.percentage)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
