import { Suspense } from "react"

import type { Garden, PaginationMeta } from "@/types"
import type { Metadata } from "next"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { GardensTable } from "./_components/gardens-table"
import { cultivationService } from "@/services/cultivation.service"

export const metadata: Metadata = {
  title: "Quản lý khu vườn | Sâm Ngọc Linh Admin",
  description: "Quản lý danh sách các khu vườn trồng sâm",
}

interface GardensPageProps {
  params: Promise<{
    lang: string
  }>
  searchParams: Promise<{
    page?: string
    perPage?: string
    search?: string
  }>
}

export default async function GardensPage({ searchParams }: GardensPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""

  let gardens: Garden[] = []
  let metadata: PaginationMeta | null = null
  let errorMsg = ""

  try {
    const res = await cultivationService.getGardens({ page, perPage, search })
    if (res.data && Array.isArray(res.data)) {
      gardens = res.data
      metadata = res.metadata || null
    }
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Không thể kết nối đến máy chủ API"
    console.error("Error fetching gardens:", e)
    errorMsg = message
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Suspense fallback={<TableSkeleton cols={5} rows={5} />}>
        <GardensTable
          initialGardens={gardens}
          metadata={metadata}
          errorMsg={errorMsg}
        />
      </Suspense>
    </div>
  )
}
