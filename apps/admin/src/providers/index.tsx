import type { DirectionType, LocaleType } from "@/types"
import type { Session } from "next-auth"
import type { ReactNode } from "react"
import type { DictionaryType } from "@/lib/get-dictionary"

import { SettingsProvider } from "@/contexts/settings-context"
import { DictionaryProvider } from "@/contexts/dictionary-context"
import { I18nProvider } from "./i18n-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DirectionProvider } from "./direction-provider"
import { ModeProvider } from "./mode-provider"
import { NextAuthProvider } from "./next-auth-provider"
import { ReactQueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"

export function Providers({
  session,
  locale,
  direction,
  dictionary,
  children,
}: Readonly<{
  session: Session | null
  locale: LocaleType
  direction: DirectionType
  dictionary?: DictionaryType | null
  children: ReactNode
}>) {
  const safeDict = (dictionary || {}) as DictionaryType

  return (
    <I18nProvider dictionary={safeDict}>
      <DictionaryProvider locale={locale} dictionary={safeDict}>
        <SettingsProvider locale={locale}>
          <ModeProvider>
            <ThemeProvider>
              <DirectionProvider direction={direction}>
                <NextAuthProvider session={session}>
                  <ReactQueryProvider>
                    <SidebarProvider>{children}</SidebarProvider>
                  </ReactQueryProvider>
                </NextAuthProvider>
              </DirectionProvider>
            </ThemeProvider>
          </ModeProvider>
        </SettingsProvider>
      </DictionaryProvider>
    </I18nProvider>
  )
}
