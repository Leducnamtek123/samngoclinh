import { Suspense } from "react"

import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"
import { createTranslator } from "@/lib/i18n"
import { getDictionary } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"
import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { OrdersTable, type Order } from "./_components/orders-table"

interface OrdersPageProps {
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

export default async function OrdersPage({ params, searchParams }: OrdersPageProps) {
  const resolvedParams = await params
  const lang = (resolvedParams?.lang || "vi") as LocaleType
  const dictionary = await getDictionary(lang)
  const t = createTranslator(dictionary)

  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const status = resolvedSearchParams.status || ""

  let orders: Order[] = []
  let metadata: any = null
  let errorMsg = ""

  try {
    const queryParams = new URLSearchParams()
    queryParams.append("page", page)
    queryParams.append("perPage", perPage)
    if (search) queryParams.append("search", search)
    if (status && status !== "all") queryParams.append("status", status)

    const res = await fetchApi(`/admin/orders?${queryParams.toString()}`)
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Failed to fetch orders"
    } else {
      orders = Array.isArray(payload.data) ? payload.data : []
      metadata = payload.metadata || null
    }
  } catch (e) {
    console.error("Error fetching orders:", e)
    errorMsg = "Unable to connect to server"
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("navigation.orders")}</h1>
        <p className="text-muted-foreground">
          {t("common.status.all")}
        </p>
      </div>

      <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
            {t("navigation.orders")}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t("common.status.all")}
          </p>
        </div>

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
