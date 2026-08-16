"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import type { ColumnDef } from "@/components/shared/data-table"

import { fetchApi } from "@/lib/api"

import { useDataTable } from "@/hooks/use-data-table"
import { useTranslation } from "@/providers/i18n-provider"
import { Button } from "@/components/ui/button"
import { ToastCard } from "@/components/ui/feedback-components"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/components/shared/data-table"

import type { Order, PaginationMeta } from "@/types"

interface OrdersTableProps {
  initialOrders: Order[]
  metadata: PaginationMeta | null
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

  const productType = searchParams.get("productType") || "all"

  const handleProductTypeTabChange = (val: string) => {
    const updated = new URLSearchParams(searchParams.toString())
    if (val === "all" || !val) {
      updated.delete("productType")
    } else {
      updated.set("productType", val)
    }
    updated.set("page", "1")
    router.push(`${pathname}?${updated.toString()}`)
  }

  const [localError, setLocalError] = useState(errorMsg || "")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    if (errorMsg) {
      setLocalError(errorMsg)
    }
  }, [errorMsg])

  const getStatusLabel = (status: string) => {
    if (!status) return ""
    const key = `common.status.${status.toLowerCase()}`
    const translated = t(key)
    if (translated === key) {
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    }
    return translated
  }

  const handleQuickStatusUpdate = async (
    orderId: string,
    newStatus: string
  ) => {
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

  const {
    searchVal,
    setSearchVal,
    statusFilter,
    handlePageChange,
    handleStatusFilterChange,
    resetFilters,
  } = useDataTable()

  const columns: ColumnDef<Order>[] = [
    {
      header: "Mã đơn hàng",
      className: "font-mono font-semibold text-slate-900 dark:text-slate-100",
      cell: (order) => order.code,
    },
    {
      header: "Khách hàng",
      cell: (order) => (
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
      ),
    },
    {
      header: "Thanh toán",
      className: "text-xs font-medium",
      cell: (order) =>
        order.paymentMethod === "bank_transfer" ||
        order.paymentMethod === "sepay" ||
        (order.paymentMethod || "").toLowerCase().includes("bank")
          ? "Chuyển khoản"
          : order.paymentMethod === "cod"
            ? "Thanh toán COD"
            : "Chuyển khoản",
    },
    {
      header: "Trạng thái",
      cell: (order) => {
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

        return (
          <Select
            value={statusLower}
            onValueChange={(val) => handleQuickStatusUpdate(order.id, val)}
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
        )
      },
    },
    {
      header: "Ngày tạo",
      className: "text-xs text-muted-foreground whitespace-nowrap",
      cell: (order) =>
        order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
            })
          : "-",
    },
    {
      header: "Ghi chú",
      className: "text-xs max-w-[160px] truncate text-muted-foreground",
      cell: (order) => order.customerNote || "-",
    },
    {
      header: "Tổng tiền",
      headerClassName: "text-right",
      className:
        "text-right font-semibold text-emerald-600 dark:text-emerald-400",
      cell: (order) => formatVND(order.total),
    },
  ]

  const statusOptions = [
    { label: t("common.status.all"), value: "all" },
    { label: getStatusLabel("pending"), value: "pending" },
    { label: getStatusLabel("paid"), value: "paid" },
    { label: getStatusLabel("shipping"), value: "shipping" },
    { label: getStatusLabel("completed"), value: "completed" },
    { label: getStatusLabel("cancelled"), value: "cancelled" },
  ]

  return (
    <div className="space-y-4">
      {/* Category / Product Type Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-muted/40 p-1.5 rounded-lg border w-fit">
        <Button
          type="button"
          variant={productType === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleProductTypeTabChange("all")}
          className="text-xs font-semibold px-4 h-8"
        >
          {t("orders.tabs.all")}
        </Button>
        <Button
          type="button"
          variant={productType === "plant" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleProductTypeTabChange("plant")}
          className="text-xs font-semibold px-4 h-8"
        >
          {t("orders.tabs.plant")}
        </Button>
        <Button
          type="button"
          variant={productType === "product" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleProductTypeTabChange("product")}
          className="text-xs font-semibold px-4 h-8"
        >
          {t("orders.tabs.product")}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={initialOrders}
        metadata={metadata}
        onPageChange={handlePageChange}
        emptyMessage="Không tìm thấy đơn hàng nào."
        toolbarProps={{
          searchPlaceholder: "Tìm kiếm mã đơn...",
          searchValue: searchVal,
          onSearchChange: setSearchVal,
          statusValue: statusFilter,
          onStatusChange: handleStatusFilterChange,
          statusOptions,
          statusPlaceholder: t("common.status.all"),
          onReset: resetFilters,
        }}
        rowActionsHeader="Thao tác"
        rowActions={(order) => (
          <Link
            href={`/pages/orders/details?id=${order.id}`}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Chi tiết
          </Link>
        )}
      />

      {localError && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
          <ToastCard
            type="error"
            title="Lỗi xảy ra"
            description={localError}
            onClose={() => setLocalError("")}
          />
        </div>
      )}
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
