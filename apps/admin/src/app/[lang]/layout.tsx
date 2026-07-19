import { Cairo, Lato } from "next/font/google"
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
export const metadata: Metadata = {
  title: {
    template: "%s | Sâm Ngọc Linh Admin",
    default: "Sâm Ngọc Linh Admin",
  },
  description: "Trang quản trị Rượu Sâm Ngọc Linh",
  metadataBase: new URL(process.env.BASE_URL as string),
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
const latoFont = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
})
const cairoFont = Cairo({
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal"],
  variable: "--font-cairo",
})

export default async function RootLayout(props: {
  children: ReactNode
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params

  const { children } = props

  const session = await getServerSession(authOptions)
  const direction = i18n.localeDirection[params.lang]

  return (
    <html lang={params.lang} dir={direction} suppressHydrationWarning>
      <body
        className={cn(
          "[&:lang(en)]:font-lato [&:lang(vi)]:font-lato", // Set font styles based on the language
          "bg-background text-foreground antialiased overscroll-none", // Set background, text, , anti-aliasing styles, and overscroll behavior
          latoFont.variable, // Include Lato font variable
          cairoFont.variable // Include Cairo font variable
        )}
      >
        <Providers locale={params.lang} direction={direction} session={session}>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  )
}
