"use client"

import { useRecharts } from "@/hooks/use-recharts";



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const treemapChartsData = [
  { name: "axis", size: 2100 },
  { name: "controls", size: 1600 },
  { name: "data", size: 1800 },
  { name: "layouts", size: 1900 },
  { name: "scales", size: 2100 },
  { name: "util", size: 2200 },
]

export function TreemapCharts() {
  const recharts = useRecharts();
  if (!recharts) return <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">Đang tải...</div>;
  const { Treemap } = recharts;

  return (
    <section className="conatiner grid gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Simple Tree Map</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="w-full">
            <Treemap
              data={treemapChartsData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="hsl(var(--chart-1))"
            >
              <ChartTooltip content={<ChartTooltipContent />} />
            </Treemap>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  )
}
