"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

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

export function OrdersTable({ initialOrders, metadata, errorMsg }: OrdersTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [orders, setOrders] = useState<Order[]>(initialOrders)

  // URL query params states
  const initialSearch = searchParams.get("search") || ""
  const [searchVal, setSearchVal] = useState(initialSearch)

  const statusFilter = searchParams.get("status") || "all"

  // Sync orders list on props change
  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  const createQueryString = (newParams: Record<string, string | null>) => {
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
  }

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentSearch = searchParams.get("search") || ""
      if (searchVal !== currentSearch) {
        router.push(`${pathname}?${createQueryString({ search: searchVal })}`)
      }
    }, 400)
    return () => clearTimeout(handler)
  }, [searchVal])

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?${createQueryString({ page: newPage.toString() })}`)
  }

  const handleStatusFilterChange = (val: string) => {
    router.push(`${pathname}?${createQueryString({ status: val })}`)
  }

  const formatVND = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return "default"
      case "pending":
      case "processing":
        return "secondary"
      case "cancelled":
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm mã đơn..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-10 text-sm pl-9 bg-white dark:bg-slate-900 border-slate-200"
          />
        </div>

        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="h-10 text-sm bg-white dark:bg-slate-900 border-slate-200">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xử lý (Pending)</SelectItem>
              <SelectItem value="processing">Đang xử lý (Processing)</SelectItem>
              <SelectItem value="completed">Đã hoàn thành (Completed)</SelectItem>
              <SelectItem value="cancelled">Đã hủy (Cancelled)</SelectItem>
              <SelectItem value="failed">Thất bại (Failed)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {errorMsg ? (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          {errorMsg}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-slate-500 border border-dashed rounded-xl bg-slate-50/20 dark:bg-slate-900/10">
          Không tìm thấy đơn hàng nào.
        </div>
      ) : (
        <div className="border border-slate-200/60 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-slate-900">
          <Table>
            <TableHeader className="bg-slate-50/75 dark:bg-slate-900/50">
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Tổng giá trị</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <TableCell className="font-mono font-medium text-slate-800 dark:text-slate-200">{order.code}</TableCell>
                  <TableCell className="text-slate-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status.toUpperCase()}
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
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {metadata && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Hiển thị trang {metadata.page} / {metadata.totalPage} (Tổng số {metadata.count} đơn hàng)
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!metadata.hasPrevious}
                  onClick={() => handlePageChange(metadata.page - 1)}
                  className="h-8 text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Trước</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!metadata.hasNext}
                  onClick={() => handlePageChange(metadata.page + 1)}
                  className="h-8 text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400"
                >
                  <span>Kế tiếp</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
