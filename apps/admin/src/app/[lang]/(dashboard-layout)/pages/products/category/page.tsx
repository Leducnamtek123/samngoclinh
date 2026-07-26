import { Suspense } from "react"

import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { ShopItemsTable } from "./_components/shop-items-table"

export const metadata: Metadata = {
  title: "Commercial Products & Supplies | Sâm Ngọc Linh Admin",
  description: "Manage processed products and agricultural supplies",
}

interface ShopItem {
  id: string
  code: string
  name: string
  price: number
  unit: string
  category: string
  stock?: number
  status?: string
  images?: string[]
  description?: string
}

interface CategoryPageProps {
  params: Promise<{
    lang: string
  }>
  searchParams: Promise<{
    page?: string
    perPage?: string
    search?: string
    status?: string
  }>
}

export default async function CategoryPage({
  searchParams,
}: CategoryPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const status = resolvedSearchParams.status || ""

  let shopItems: ShopItem[] = []
  let metadata: any = null
  let errorMsg = ""

  try {
    const queryParams = new URLSearchParams()
    queryParams.append("page", page)
    queryParams.append("perPage", perPage)
    if (search) queryParams.append("search", search)
    if (status && status !== "all") queryParams.append("status", status)

    const res = await fetchApi(
      `/public/catalog/shop-items?${queryParams.toString()}`
    )
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Failed to load shop items"
    } else {
      shopItems = Array.isArray(payload.data)
        ? payload.data
        : payload.data?.items || []
      metadata = payload.metadata || null
    }
  } catch (e) {
    console.error("Error fetching shop items:", e)
    errorMsg = "Unable to connect to server"
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <Suspense fallback={<TableSkeleton cols={5} rows={5} />}>
        <ShopItemsTable
          initialItems={shopItems}
          metadata={metadata}
          errorMsg={errorMsg}
        />
      </Suspense>
    </div>
  )
}
