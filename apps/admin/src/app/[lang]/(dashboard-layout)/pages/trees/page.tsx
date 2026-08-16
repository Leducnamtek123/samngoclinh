import { Suspense } from "react"

import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { TreesTable } from "./_components/trees-table"

export const metadata: Metadata = {
  title: "Manage Plants & Trees | Sâm Ngọc Linh Admin",
  description: "Track and manage Ginseng trees and gardens",
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
  const ageYear = resolvedSearchParams.ageYear || ""

  let trees: any[] = []
  let beds: any[] = []
  let metadata: any = null
  let errorMsg = ""

  try {
    const treeQueryParams = new URLSearchParams()
    treeQueryParams.append("page", page)
    treeQueryParams.append("perPage", perPage)
    if (search) treeQueryParams.append("search", search)
    if (status && status !== "all") treeQueryParams.append("status", status)
    if (ageYear && ageYear !== "all") treeQueryParams.append("ageYear", ageYear)

    const treesRes = await fetchApi(
      `/admin/cultivation/trees?${treeQueryParams.toString()}`
    )
    const treesPayload = await treesRes.json()
    if (treesRes.status >= 400) {
      errorMsg = treesPayload?.message || "Failed to load trees"
    } else {
      trees = Array.isArray(treesPayload.data) ? treesPayload.data : []
      metadata = treesPayload.metadata || null
    }

    const bedsRes = await fetchApi("/user/cultivation/beds?perPage=100")
    const bedsPayload = await bedsRes.json()
    if (bedsRes.status < 400) {
      beds = Array.isArray(bedsPayload.data?.items)
        ? bedsPayload.data.items
        : bedsPayload.data || []
    }
  } catch (e) {
    console.error("Error fetching trees data on server:", e)
    errorMsg = "Unable to connect to server"
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
