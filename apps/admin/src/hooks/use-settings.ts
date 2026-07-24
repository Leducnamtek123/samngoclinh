"use client"

import { createContext, useContext } from "react"

import type { SettingsType } from "@/types"

export const defaultSettings: SettingsType = {
  theme: "green",
  mode: "system",
  radius: 0.5,
  layout: "vertical",
  locale: "vi",
}

export const SettingsContext = createContext<
  | {
      settings: SettingsType
      updateSettings: (newSettings: SettingsType) => void
      resetSettings: () => void
    }
  | undefined
>(undefined)

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
