import { Lato } from "next/font/google"

import { cn } from "@/lib/utils"
import { getDictionary } from "@/lib/get-dictionary"

import "../globals.css"

import { Providers } from "@/providers"

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
  metadataBase: getMetadataBase(),
}

// Define fonts for the application
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
const latoFont = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
})

export default async function RootLayout({ children }: { children: ReactNode }) {
  const dictionary = await getDictionary("en")
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "[&:lang(en)]:font-lato", // Set font styles based on the language
          "bg-background text-foreground antialiased overscroll-none", // Set background, text, , anti-aliasing styles, and overscroll behavior
          latoFont.variable // Include Lato font variable
        )}
      >
        <Providers locale="en" direction="ltr" session={null} dictionary={dictionary}>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  )
}
