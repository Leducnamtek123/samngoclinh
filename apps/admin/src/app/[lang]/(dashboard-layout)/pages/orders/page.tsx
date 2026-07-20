import { Suspense } from "react"
import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { OrdersTable } from "./_components/orders-table"
import { TableSkeleton } from "@/components/ui/loading-skeletons"

export const metadata: Metadata = {
  title: "Quản lý Đơn hàng | Sâm Ngọc Linh Admin",
  description: "Danh sách đơn hàng trong hệ thống Sâm Ngọc Linh",
}

interface Order {
  id: string
  code: string
  status: string
  total: number
  createdAt?: string
}

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

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
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
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Đơn hàng</h1>
        <p className="text-muted-foreground">
          Theo dõi và xử lý đơn đặt hàng của khách hàng từ website.
        </p>
      </div>

      <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">Danh sách đơn hàng</h2>
          <p className="text-xs text-muted-foreground">
            Hiển thị thông tin mã đơn, trạng thái, tổng tiền thanh toán và thời gian tạo.
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
