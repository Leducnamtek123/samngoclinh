"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2, Search } from "lucide-react"

import { useTranslation } from "@/providers/i18n-provider"
import { fetchApi } from "@/lib/api"
import { useEvent } from "@/hooks/use-event"
import { Pagination } from "@/components/ui/app-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToastCard } from "@/components/ui/feedback-components"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface Order {
  id: string
  code: string
  status: string
  total: number
  paymentMethod?: string | null
  customerName?: string | null
  customerPhone?: string | null
  customerNote?: string | null
  createdAt?: string
}

interface OrdersTableProps {
  initialOrders: Order[]
  metadata: {
    page: number
    perPage: number
    totalPage: number
    count: number
    hasNext: boolean
    hasPrevious: boolean
  } | null
  errorMsg?: string
}

export function OrdersTable({
  initialOrders,
  metadata,
  errorMsg,
}: OrdersTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const getStatusLabel = (status: string) => {
    if (!status) return ""
    const key = `common.status.${status.toLowerCase()}`
    const translated = t(key)
    if (translated === key) {
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    }
    return translated
  }

  const [localError, setLocalError] = useState(errorMsg || "")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    if (errorMsg) {
      setLocalError(errorMsg)
    }
  }, [errorMsg])

  const handleQuickStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    setLocalError("")
    try {
      const res = await fetchApi(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const payload = await res.json()
      if (res.status >= 400) {
        setLocalError(
          payload?.message || "Không thể cập nhật trạng thái đơn hàng"
        )
      } else {
        router.refresh()
      }
    } catch (e) {
      console.error(e)
      setLocalError("Lỗi kết nối máy chủ khi cập nhật trạng thái")
    } finally {
      setUpdatingId(null)
    }
  }

  // URL query params states
  const initialSearch = searchParams.get("search") || ""
  const [searchVal, setSearchVal] = useState(initialSearch)

  const statusFilter = searchParams.get("status") || "all"

  const createQueryString = useCallback(
    (newParams: Record<string, string | null>) => {
      const updatedSearchParams = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(newParams)) {
        if (value === null || value === "all" || value === "") {
          updatedSearchParams.delete(key)
        } else {
          updatedSearchParams.set(key, value)
        }
      }
      if (!newParams.hasOwnProperty("page")) {
        updatedSearchParams.set("page", "1")
      }
      return updatedSearchParams.toString()
    },
    [searchParams]
  )

  const onSearch = useEvent(() => {
    const currentSearch = searchParams.get("search") || ""
    if (searchVal !== currentSearch) {
      router.push(`${pathname}?${createQueryString({ search: searchVal })}`)
    }
  })

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch()
    }, 400)
    return () => clearTimeout(handler)
  }, [searchVal, onSearch])

  const handlePageChange = (newPage: number) => {
    router.push(
      `${pathname}?${createQueryString({ page: newPage.toString() })}`
    )
  }

  const handleStatusFilterChange = (val: string) => {
    router.push(`${pathname}?${createQueryString({ status: val })}`)
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm mã đơn..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-10 text-sm pl-9 bg-background border border-input"
          />
        </div>

        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="h-10 text-sm bg-background border border-input">
              <SelectValue placeholder={t("common.status.all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.status.all")}</SelectItem>
              <SelectItem value="pending">{getStatusLabel("pending")}</SelectItem>
              <SelectItem value="paid">{getStatusLabel("paid")}</SelectItem>
              <SelectItem value="shipping">{getStatusLabel("shipping")}</SelectItem>
              <SelectItem value="completed">{getStatusLabel("completed")}</SelectItem>
              <SelectItem value="cancelled">{getStatusLabel("cancelled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {initialOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl bg-muted/10">
          Không tìm thấy đơn hàng nào.
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden shadow-xs bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialOrders.map((order) => {
                const statusLower = (order.status || "").toLowerCase()
                const isFinalStatus =
                  statusLower === "completed" ||
                  statusLower === "cancelled" ||
                  statusLower === "success"
                const isUpdatingThis = updatingId === order.id

                const badgeClass =
                  statusLower === "completed" || statusLower === "success"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold"
                    : statusLower === "paid" || statusLower === "shipping"
                      ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold"
                      : statusLower === "pending" || statusLower === "processing"
                        ? "bg-amber-50 text-amber-700 border-amber-300 font-semibold"
                        : "bg-red-50 text-red-700 border-red-300 font-semibold"

                const paymentMethodText =
                  order.paymentMethod === "bank_transfer" ||
                  order.paymentMethod === "sepay" ||
                  (order.paymentMethod || "").toLowerCase().includes("bank")
                    ? "Chuyển khoản"
                    : order.paymentMethod === "cod"
                      ? "Thanh toán COD"
                      : "Chuyển khoản"

                return (
                  <TableRow key={order.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {order.code}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {order.customerName || "Khách lẻ"}
                        </span>
                        {order.customerPhone && (
                          <span className="text-xs text-muted-foreground font-mono">
                            {order.customerPhone}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {paymentMethodText}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={statusLower}
                        onValueChange={(val) =>
                          handleQuickStatusUpdate(order.id, val)
                        }
                        disabled={isFinalStatus || isUpdatingThis}
                      >
                        <SelectTrigger
                          className={`h-8 w-[145px] text-xs shadow-none border ${badgeClass} ${
                            isFinalStatus
                              ? "opacity-75 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          {isUpdatingThis ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-muted-foreground" />
                          ) : (
                            <SelectValue>{getStatusLabel(statusLower)}</SelectValue>
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="pending"
                            className="text-xs font-semibold text-amber-700"
                          >
                            {getStatusLabel("pending")}
                          </SelectItem>
                          <SelectItem
                            value="paid"
                            className="text-xs font-semibold text-blue-700"
                          >
                            {getStatusLabel("paid")}
                          </SelectItem>
                          <SelectItem
                            value="shipping"
                            className="text-xs font-semibold text-blue-700"
                          >
                            {getStatusLabel("shipping")}
                          </SelectItem>
                          <SelectItem
                            value="completed"
                            className="text-xs font-semibold text-emerald-700"
                          >
                            {getStatusLabel("completed")}
                          </SelectItem>
                          <SelectItem
                            value="cancelled"
                            className="text-xs font-semibold text-red-700"
                          >
                            {getStatusLabel("cancelled")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
                            timeZone: "Asia/Ho_Chi_Minh",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-xs max-w-[160px] truncate text-muted-foreground">
                      {order.customerNote || "-"}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatVND(order.total)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link
                        href={`/pages/orders/details?id=${order.id}`}
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        Chi tiết
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <Pagination metadata={metadata} onPageChange={handlePageChange} />
        </div>
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
        {localError && (
          <ToastCard
            type="error"
            title="Lỗi xảy ra"
            description={localError}
            onClose={() => setLocalError("")}
          />
        )}
      </div>
    </div>
  )
}

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

const formatVND = (price: number) => {
  return vndFormatter.format(price)
}
