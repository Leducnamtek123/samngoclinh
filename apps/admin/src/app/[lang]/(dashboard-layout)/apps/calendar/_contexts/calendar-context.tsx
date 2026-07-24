"use client"

import { useCallback, useMemo, useReducer, useState } from "react"

import type { CalendarApi } from "@fullcalendar/core/index.js"
import type { ReactNode } from "react"
import type {
  CalendarContextType,
  CategoryType,
  EventType,
  EventWithoutIdType,
} from "../types"

import { categoriesData } from "../_data/categories"

import { CalendarContext } from "../_hooks/calendar-context"
import { CalendarReducer } from "../_reducers/calendar-reducer"

// Create Kanban context

export function CalendarProvider({
  events,
  children,
}: {
  events: EventType[]
  children: ReactNode
}) {
  // Reducer to manage Calendar state
  const [calendarState, dispatch] = useReducer(CalendarReducer, {
    initalEvents: events,
    events,
    selectedCategories: [...categoriesData],
  })

  // State management
  const [calendarApi, setCalendarApi] = useState<null | CalendarApi>(null)
  const [eventSidebarIsOpen, setEventSidebarIsOpen] = useState(false)

  // Handlers for event actions
  const handleAddEvent = useCallback(
    (event: EventWithoutIdType) => {
      dispatch({
        type: "addEvent",
        event: { ...event, id: calendarState.events.length.toString() },
      })
    },
    [calendarState.events.length]
  )

  const handleUpdateEvent = useCallback((event: EventType) => {
    dispatch({ type: "updateEvent", event })
  }, [])

  const handleDeleteEvent = useCallback((eventId: EventType["id"]) => {
    dispatch({ type: "deleteEvent", eventId })
  }, [])

  // Selection handlers
  const handleSelectEvent = useCallback((event?: EventType) => {
    dispatch({ type: "selectEvent", event: event })
  }, [])

  const handleSelectCategory = useCallback((category: CategoryType) => {
    dispatch({ type: "selectCategory", category })
  }, [])

  const handleSelectAllCategories = useCallback(
    (isSelectAllCategories: boolean) => {
      dispatch({ type: "selectAllCategories", isSelectAllCategories })
    },
    []
  )

  const contextValue = useMemo(
    () => ({
      calendarState,
      calendarApi,
      setCalendarApi,
      eventSidebarIsOpen,
      setEventSidebarIsOpen,
      handleUpdateEvent,
      handleAddEvent,
      handleDeleteEvent,
      handleSelectEvent,
      handleSelectCategory,
      handleSelectAllCategories,
    }),
    [
      calendarState,
      calendarApi,
      eventSidebarIsOpen,
      handleUpdateEvent,
      handleAddEvent,
      handleDeleteEvent,
      handleSelectEvent,
      handleSelectCategory,
      handleSelectAllCategories,
    ]
  )

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  )
}
