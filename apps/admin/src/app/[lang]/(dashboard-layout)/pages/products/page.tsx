import { Suspense } from "react"

import type { PaginationMeta, ShopItem } from "@/types"
import type { Metadata } from "next"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { ShopItemsTable } from "./category/_components/shop-items-table"
import { catalogService } from "@/services/catalog.service"

export const metadata: Metadata = {
  title: "Quản lý sản phẩm thương mại | Sâm Ngọc Linh Admin",
  description: "Quản lý danh sách các sản phẩm rượu sâm và chế phẩm thương mại",
}

interface ProductsPageProps {
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

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const status = resolvedSearchParams.status || ""

  let shopItems: ShopItem[] = []
  let metadata: PaginationMeta | null = null
  let errorMsg = ""

  try {
    const res = await catalogService.getShopItems({
      page,
      perPage,
      search,
      status,
    })
    if (res.data && Array.isArray(res.data)) {
      shopItems = res.data
      metadata = res.metadata || null
    }
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Không thể kết nối đến máy chủ API"
    console.error("Error fetching shop items:", e)
    errorMsg = message
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
