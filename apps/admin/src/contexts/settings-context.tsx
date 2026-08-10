"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useCookie } from "react-use"

import type { LocaleType, SettingsType } from "@/types"
import type { ReactNode } from "react"

import { SettingsContext, defaultSettings } from "@/hooks/use-settings"

export function SettingsProvider({
  locale,
  children,
}: {
  locale: LocaleType
  children: ReactNode
}) {
  const [storedSettings, setStoredSettings, deleteStoredSettings] =
    useCookie("settings")
  const [settings, setSettings] = useState<SettingsType>({
    ...defaultSettings,
    locale,
  })

  useEffect(() => {
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    } else {
      setSettings({ ...defaultSettings, locale })
    }
  }, [storedSettings, locale])

  const updateSettings = useCallback(
    (newSettings: SettingsType) => {
      setStoredSettings(JSON.stringify(newSettings))
      setSettings(newSettings)
    },
    [setStoredSettings]
  )

  const resetSettings = useCallback(() => {
    deleteStoredSettings()
    setSettings(defaultSettings)
  }, [deleteStoredSettings])

  const contextValue = useMemo(
    () => ({ settings, updateSettings, resetSettings }),
    [settings, updateSettings, resetSettings]
  )

  // Render children only when settings are ready
  if (!settings) {
    return null
  }

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}
