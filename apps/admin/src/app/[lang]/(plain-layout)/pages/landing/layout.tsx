import type { LocaleType } from "@/types"
import type { ReactNode } from "react"

import { getDictionary } from "@/lib/get-dictionary"

import { Layout } from "./_components/layout"

export default async function LandingLayout(props: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const params = await props.params
  const lang = params.lang as LocaleType

  const { children } = props

  const dictionary = await getDictionary(lang)

  return <Layout dictionary={dictionary}>{children}</Layout>
}
