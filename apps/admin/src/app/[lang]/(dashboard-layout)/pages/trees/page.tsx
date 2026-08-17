import { Suspense } from "react"

import type { Bed, PaginationMeta, Tree } from "@/types"
import type { Metadata } from "next"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { TreesTable } from "./_components/trees-table"
import { cultivationService } from "@/services/cultivation.service"

export const metadata: Metadata = {
  title: "Quản lý cây sâm | Sâm Ngọc Linh Admin",
  description: "Theo dõi và quản lý danh sách cây sâm giống và vườn canh tác",
}

interface TreesPageProps {
  params: Promise<{
    lang: string
  }>
  searchParams: Promise<{
    page?: string
    perPage?: string
    search?: string
    status?: string
    ageYear?: string
  }>
}

export default async function TreesPage({ searchParams }: TreesPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const status = resolvedSearchParams.status || ""

  let trees: Tree[] = []
  let beds: Bed[] = []
  let metadata: PaginationMeta | null = null
  let errorMsg = ""

  try {
    const [treesRes, bedsRes] = await Promise.all([
      cultivationService
        .getTrees({ page, perPage, search, status })
        .catch(() => null),
      cultivationService.getBeds({ perPage: 100 }).catch(() => null),
    ])

    if (treesRes?.data && Array.isArray(treesRes.data)) {
      trees = treesRes.data
      metadata = treesRes.metadata || null
    }

    if (bedsRes?.data && Array.isArray(bedsRes.data)) {
      beds = bedsRes.data
    }
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Unable to connect to server"
    console.error("Error fetching trees data on server:", e)
    errorMsg = message
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Suspense fallback={<TableSkeleton cols={6} rows={5} />}>
        <TreesTable
          initialTrees={trees}
          beds={beds}
          metadata={metadata}
          errorMsg={errorMsg}
        />
      </Suspense>
    </div>
  )
}
