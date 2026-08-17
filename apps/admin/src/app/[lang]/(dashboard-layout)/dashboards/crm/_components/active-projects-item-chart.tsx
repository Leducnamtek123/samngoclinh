import { useRadius } from "@/hooks/use-radius"
import { useRecharts } from "@/hooks/use-recharts"
import { ChartContainer } from "@/components/ui/chart"

export function ActiveProjectsItemChart({
  value,
  maxRating = 100,
  color = "hsl(var(--success))",
}: {
  value: number
  maxRating?: number
  color?: string
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

  return (
    <ChartContainer config={{}} className="aspect-square h-16">
      <RadialBarChart
        accessibilityLayer
        data={[{ value }]}
        innerRadius={25}
        outerRadius="150%"
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
          fill={color}
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
                      y={(viewBox.cy || 0) + 2}
                      className="fill-foreground text-sm font-semibold"
                    >
                      {value}%
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
