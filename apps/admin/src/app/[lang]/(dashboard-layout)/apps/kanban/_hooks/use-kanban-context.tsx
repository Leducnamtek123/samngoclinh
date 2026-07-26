"use client"

import { createContext, useContext } from "react"

import type { KanbanContextType } from "../types"

export const KanbanContext = createContext<KanbanContextType | undefined>(
  undefined
)

export function useKanbanContext() {
  const context = useContext(KanbanContext)
  if (context === undefined) {
    throw new Error("useKanbanContext must be used within a KanbanProvider")
  }
  return context
}
