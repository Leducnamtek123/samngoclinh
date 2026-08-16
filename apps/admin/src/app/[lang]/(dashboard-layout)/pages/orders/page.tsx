import { Suspense } from "react"

import type { Metadata } from "next"
import type { LocaleType, Order, PaginationMeta } from "@/types"

import { ordersService } from "@/services/orders.service"
import { getDictionary } from "@/lib/get-dictionary"
import { createTranslator } from "@/lib/i18n"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { OrdersTable } from "./_components/orders-table"

interface OrdersPageProps {
  params: Promise<{
    lang: string
  }>
  searchParams: Promise<{
    page?: string
    perPage?: string
    search?: string
    status?: string
    productType?: string
  }>
}

export const metadata: Metadata = {
  title: "Quản lý đơn hàng | Sâm Ngọc Linh Admin",
  description: "Quản lý và xử lý đơn hàng cây sâm, gói dịch vụ và sản phẩm thương mại",
}

export default async function OrdersPage({
  params,
  searchParams,
}: OrdersPageProps) {
  const resolvedParams = await params
  const lang = (resolvedParams?.lang || "vi") as LocaleType
  const dictionary = await getDictionary(lang)
  const t = createTranslator(dictionary)

  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const status = resolvedSearchParams.status || ""
  const productType = resolvedSearchParams.productType || ""

  let orders: Order[] = []
  let metadata: PaginationMeta | null = null
  let errorMsg = ""

  try {
    const res = await ordersService.getOrders({
      page,
      perPage,
      search,
      status,
      productType,
    })
    if (res.data && Array.isArray(res.data)) {
      orders = res.data
      metadata = res.metadata || null
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Không thể kết nối đến máy chủ API"
    console.error("Error fetching orders:", e)
    errorMsg = message
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t("navigation.orders")}
        </h1>
        <p className="text-sm text-muted-foreground">
          Quản lý, tra cứu và xử lý toàn bộ đơn hàng cây giống, gói chăm sóc và sản phẩm thương mại
        </p>
      </div>

      <div className="bg-card text-card-foreground border border-border rounded-2xl p-4 sm:p-6 shadow-xs">
        <Suspense fallback={<TableSkeleton cols={5} rows={5} />}>
          <OrdersTable
            initialOrders={orders}
            metadata={metadata}
            errorMsg={errorMsg}
          />
        </Suspense>
      </div>
    </div>
  )
}
