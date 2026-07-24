"use client"

import { createContext, useContext, useMemo } from "react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { ReactNode } from "react"

import { translate } from "@/lib/i18n"

interface I18nContextType {
  dictionary: DictionaryType
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({
  dictionary,
  children,
}: {
  dictionary: DictionaryType
  children: ReactNode
}) {
  const t = useMemo(
    () => (key: string, params?: Record<string, string | number>) =>
      translate(dictionary, key, params),
    [dictionary]
  )

  const value = useMemo(() => ({ dictionary, t }), [dictionary, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    // Fallback if not used inside provider
    return {
      dictionary: {} as DictionaryType,
      t: (key: string, params?: Record<string, string | number>) => {
        if (!params) return key
        let str = key
        Object.entries(params).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v))
        })
        return str
      },
    }
  }
  return context
}
