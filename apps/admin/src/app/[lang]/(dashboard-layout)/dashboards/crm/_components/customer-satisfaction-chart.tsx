"use client"

import type { CustomerSatisfactionType } from "../types"

import { ratingToPercentage } from "@/lib/utils"

import { useRadius } from "@/hooks/use-radius"
import { useRecharts } from "@/hooks/use-recharts"
import { ChartContainer } from "@/components/ui/chart"

export function CustomerSatisfactionChart({
  data,
}: {
  data: CustomerSatisfactionType["summary"]
}) {
  const recharts = useRecharts()
  const radius = useRadius()
  if (!recharts)
    return (
      <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    )
  const { Label, PolarAngleAxis, PolarRadiusAxis, RadialBar, RadialBarChart } =
    recharts

  const maxRating = 5

  return (
    <ChartContainer config={{}} className="aspect-square h-[12.5rem] md:w-2/5">
      <RadialBarChart
        accessibilityLayer
        data={[data]}
        endAngle={360}
        innerRadius={80}
        outerRadius={150}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, maxRating]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background
          dataKey="value"
          cornerRadius={radius}
          fill="hsl(var(--primary))"
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={(props) => {
              const viewBox = props.viewBox as
                | { cx?: number; cy?: number }
                | undefined
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-4xl font-semibold"
                    >
                      {data.value} / 5
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="text-sm fill-muted-foreground"
                    >
                      {ratingToPercentage(data.value, maxRating)} Satisfied
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}
