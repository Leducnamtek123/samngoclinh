"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

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

interface Order {
  id: string
  code: string
  status: string
  total: number
  createdAt: string
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

  const [localError, setLocalError] = useState(errorMsg || "")

  useEffect(() => {
    if (errorMsg) {
      setLocalError(errorMsg)
    }
  }, [errorMsg])

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
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ thanh toán (Pending)</SelectItem>
              <SelectItem value="paid">Đã thanh toán (Paid)</SelectItem>
              <SelectItem value="shipping">Đang giao hàng (Shipping)</SelectItem>
              <SelectItem value="completed">
                Đã hoàn thành (Completed)
              </SelectItem>
              <SelectItem value="cancelled">Đã hủy (Cancelled)</SelectItem>
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
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Tổng giá trị</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialOrders.map((order) => {
                const statusLower = (order.status || "").toLowerCase()
                const badgeClass =
                  statusLower === "completed" || statusLower === "success"
                    ? "bg-emerald-500/10 text-emerald-600 border-transparent font-semibold hover:bg-emerald-500/15"
                    : statusLower === "paid" || statusLower === "shipping"
                      ? "bg-blue-500/10 text-blue-600 border-transparent font-semibold hover:bg-blue-500/15"
                      : statusLower === "pending" || statusLower === "processing"
                        ? "bg-amber-500/10 text-amber-600 border-transparent font-semibold hover:bg-amber-500/15"
                        : "bg-red-500/10 text-red-600 border-transparent font-semibold hover:bg-red-500/15"

                return (
                  <TableRow key={order.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono font-medium">
                      {order.code}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
                            timeZone: "Asia/Ho_Chi_Minh",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={badgeClass}>
                        {(order.status || "").toUpperCase()}
                      </Badge>
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
