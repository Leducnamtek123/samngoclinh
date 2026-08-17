"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import type { LocaleType } from "@/types"
import type { DictionaryType } from "@/lib/get-dictionary"
import { createTranslator } from "@/lib/i18n"

export interface DictionaryContextValue {
  locale: LocaleType
  dictionary: DictionaryType | null
  t: (key: string, params?: Record<string, string | number>) => string
}

export const DictionaryContext = createContext<DictionaryContextValue>({
  locale: "vi",
  dictionary: null,
  t: (key: string) => key,
})

export function DictionaryProvider({
  locale,
  dictionary,
  children,
}: {
  locale: LocaleType
  dictionary?: DictionaryType | null
  children: ReactNode
}) {
  const t = useMemo(() => {
    return createTranslator(dictionary || {})
  }, [dictionary])

  const contextValue = useMemo<DictionaryContextValue>(() => ({
    locale,
    dictionary: dictionary || null,
    t,
  }), [locale, dictionary, t])

  return (
    <DictionaryContext.Provider value={contextValue}>
      {children}
    </DictionaryContext.Provider>
  )
}

export function useDictionary() {
  return useContext(DictionaryContext)
}

export function useTranslation() {
  const { t } = useContext(DictionaryContext)
  return t
}
