"use client"

import dynamic from "next/dynamic"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarHeader } from "./calendar-header"

const CalendarContent = dynamic(
  () =>
    import("./calendar-content").then((mod) => mod.CalendarContent),
  {
    ssr: false,
    loading: () => (
      <div className="p-6 h-[700px] flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>
    ),
  }
)

export function CalendarView() {
  return (
    <Card>
      <CalendarHeader />
      <CalendarContent />
    </Card>
  )
}
