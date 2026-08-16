import type { Metadata } from "next"

import { getEventsData } from "./_data/events"

import { Card } from "@/components/ui/card"
import { CalendarContent } from "./_components/calendar-content"
import { CalendarHeader } from "./_components/calendar-header"
import { CalendarWrapper } from "./_components/calendar-wrapper"

// Define metadata for the page
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title: "Calendar",
}

export default function CalendarPage() {
  const events = getEventsData()
  return (
    <CalendarWrapper events={events}>
      <Card>
        <CalendarHeader />
        <CalendarContent />
      </Card>
    </CalendarWrapper>
  )
}
