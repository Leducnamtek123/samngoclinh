"use client"

import { createContext, useContext } from "react"
import type { CalendarContextType } from "../types"

export const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
)

export function useCalendarContext() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error("useCalendarContext must be used within a CalendarProvider")
  }
  return context
}
