import type { Metadata } from "next"

import { getEventsData } from "./_data/events"
import { CalendarWrapper } from "./_components/calendar-wrapper"
import { CalendarView } from "./_components/calendar-view"

export const metadata: Metadata = {
  title: "Calendar",
}

export default function CalendarPage() {
  const events = getEventsData()
  return (
    <CalendarWrapper events={events}>
      <CalendarView />
    </CalendarWrapper>
  )
}
