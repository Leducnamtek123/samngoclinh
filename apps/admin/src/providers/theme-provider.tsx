"use client"

import { useEffect } from "react"

import type { ReactNode } from "react"

import { useSettings } from "@/hooks/use-settings"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()

  useEffect(() => {
    const bodyElement = document.body

    for (const className of Array.from(bodyElement.classList)) {
      if (className.startsWith("theme-") || className.startsWith("radius-")) {
        bodyElement.classList.remove(className)
      }
    }

    bodyElement.classList.add(`theme-${settings.theme}`)
    bodyElement.classList.add(`radius-${settings.radius ?? 0.5}`)
  }, [settings.theme, settings.radius])

  return <>{children}</>
}
