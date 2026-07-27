"use client"

import type { RevenueBySourceType } from "../types"

import { useIsRtl } from "@/hooks/use-is-rtl"
import { useRadius } from "@/hooks/use-radius"
import { useRecharts } from "@/hooks/use-recharts"
import { ChartContainer } from "@/components/ui/chart"

export function RevenueBySourceChart({
  data,
}: {
  data: RevenueBySourceType["sources"]
}) {
  const recharts = useRecharts()
  const isRtl = useIsRtl()
  const radius = useRadius()
  if (!recharts)
    return (
      <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    )
  const { Bar, BarChart, XAxis, YAxis } = recharts

  const chartData = data.reduce((acc: { [key: string]: number }, source) => {
    acc[source.name.toLocaleLowerCase()] = source.value
    return acc
  }, {})

  return (
    <ChartContainer config={{}} className="h-4 w-full">
      <BarChart
        accessibilityLayer
        data={[chartData]}
        layout="vertical"
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis type="number" reversed={isRtl} hide />
        <YAxis type="category" hide />
        {data.map((item) => (
          <Bar
            key={item.name}
            dataKey={item.name.toLocaleLowerCase()}
            stackId="a"
            fill={item.fill}
            radius={radius}
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}
