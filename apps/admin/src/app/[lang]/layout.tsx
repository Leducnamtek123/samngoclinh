import { Cairo, Inter } from "next/font/google"
import { cookies } from "next/headers"
import { getServerSession } from "next-auth"

import { i18n } from "@/configs/i18n"
import { authOptions } from "@/configs/next-auth"
import { cn } from "@/lib/utils"

import "../globals.css"

import { Providers } from "@/providers"

import type { LocaleType } from "@/types"
import type { Metadata } from "next"
import type { ReactNode } from "react"

import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"

// Define metadata for the application
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
const getMetadataBase = (): URL => {
  try {
    const base = process.env.BASE_URL || "http://localhost:3000"
    return new URL(base.startsWith("http") ? base : `http://${base}`)
  } catch {
    return new URL("http://localhost:3000")
  }
}

export const metadata: Metadata = {
  title: {
    template: "%s | Sâm Ngọc Linh Admin",
    default: "Sâm Ngọc Linh Admin",
  },
  description: "Trang quản trị Rượu Sâm Ngọc Linh",
  metadataBase: getMetadataBase(),
  icons: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png?v=2",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png?v=2",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png?v=2",
    },
    {
      rel: "icon",
      url: "/favicon.ico?v=2",
    },
  ],
}

// Define fonts for the application
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
const interFont = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
})
const cairoFont = Cairo({
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal"],
  variable: "--font-cairo",
})

export default async function RootLayout(props: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const params = await props.params
  const lang = (params.lang || "vi") as LocaleType

  const { children } = props

  const session = await getServerSession(authOptions)
  const direction = i18n.localeDirection[lang] || "ltr"

  const cookieStore = await cookies()
  const settingsCookie = cookieStore.get("settings")?.value
  let initialTheme = "green"
  let initialRadius = 0.5

  if (settingsCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(settingsCookie))
      if (parsed.theme) initialTheme = parsed.theme
      if (parsed.radius !== undefined) initialRadius = parsed.radius
    } catch (_e) {
      // Ignore JSON parse errors
    }
  }

  return (
    <html lang={lang} dir={direction} suppressHydrationWarning>
      <body
        className={cn(
          `theme-${initialTheme}`,
          `radius-${initialRadius}`,
          "[&:lang(en)]:font-sans [&:lang(vi)]:font-sans font-sans", // Set font styles based on the language
          "bg-background text-foreground antialiased overscroll-none", // Set background, text, anti-aliasing styles, and overscroll behavior
          interFont.variable, // Include Inter font variable
          cairoFont.variable // Include Cairo font variable
        )}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var match = document.cookie.match(new RegExp('(?:^|; )settings=([^;]*)'));
                  if (match) {
                    var settings = JSON.parse(decodeURIComponent(match[1]));
                    if (settings.theme) {
                      for (var i = document.body.classList.length - 1; i >= 0; i--) {
                        var cls = document.body.classList[i];
                        if (cls.startsWith('theme-') || cls.startsWith('radius-')) {
                          document.body.classList.remove(cls);
                        }
                      }
                      document.body.classList.add('theme-' + settings.theme);
                      document.body.classList.add('radius-' + (settings.radius || 0.5));
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <Providers locale={lang} direction={direction} session={session}>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  )
}
