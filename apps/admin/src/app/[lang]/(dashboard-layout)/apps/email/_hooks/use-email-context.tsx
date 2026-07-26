"use client"

import { createContext, useContext } from "react"

import type { EmailContextType } from "../types"

export const EmailContext = createContext<EmailContextType | undefined>(
  undefined
)

export function useEmailContext() {
  const context = useContext(EmailContext)
  if (context === undefined) {
    throw new Error("useEmailContext must be used within an EmailProvider")
  }
  return context
}
