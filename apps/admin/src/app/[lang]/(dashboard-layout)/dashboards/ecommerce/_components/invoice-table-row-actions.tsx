"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { EllipsisVertical, Eye, FileText, Package, Trash2 } from "lucide-react"

import type { Row } from "@tanstack/react-table"
import type { InvoiceType } from "../types"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ordersService } from "@/services/orders.service"

const DELIVERY_STATUSES = [
  { label: "Đã giao hàng", value: "Delivered" },
  { label: "Đang giao hàng", value: "Shipped" },
  { label: "Đang vận chuyển", value: "In Transit" },
  { label: "Đang xử lý", value: "Processing" },
  { label: "Chờ xử lý", value: "Pending" },
]

interface InvoiceTableRowActionsProps<TData> {
  row: Row<TData>
}

export function InvoiceTableRowActions<TData>({
  row,
}: InvoiceTableRowActionsProps<TData>) {
  const invoice = row.original as InvoiceType
  const [currentStatus, setCurrentStatus] = useState(
    invoice.deliveryStatus || "Pending"
  )
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    try {
      if (invoice.invoiceId) {
        await ordersService
          .updateOrderStatus(invoice.invoiceId, newStatus.toLowerCase())
          .catch((err) => {
            console.warn("Order status update warning:", err)
          })
      }
      setCurrentStatus(newStatus as InvoiceType["deliveryStatus"])
      const statusObj = DELIVERY_STATUSES.find((s) => s.value === newStatus)
      toast.success(
        `Đã cập nhật đơn #${invoice.invoiceId} sang: ${statusObj?.label || newStatus}`
      )
    } catch (e) {
      toast.error("Không thể cập nhật trạng thái đơn hàng.")
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault()
    toast.info(`Đang chuẩn bị in hóa đơn #${invoice.invoiceId}...`)
    setTimeout(() => {
      window.print()
    }, 300)
  }

  const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (invoice.invoiceId) {
      await ordersService
        .updateOrderStatus(invoice.invoiceId, "cancelled")
        .catch(() => {})
    }
    setCurrentStatus("Pending")
    toast.error(`Đã tiếp nhận yêu cầu hủy đơn hàng #${invoice.invoiceId}`)
  }

  return (
    <div className="flex justify-end me-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            aria-label="Thao tác"
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[220px]">
          <DropdownMenuItem asChild>
            <Link
              href="/pages/orders"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Eye className="h-4 w-4 text-emerald-600" />
              <span>Xem chi tiết đơn hàng</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handlePrint}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FileText className="h-4 w-4 text-blue-600" />
            <span>In phiếu giao hàng</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-600" />
              <span>Đổi trạng thái vận chuyển</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={currentStatus}
                onValueChange={handleStatusChange}
              >
                {DELIVERY_STATUSES.map((status) => (
                  <DropdownMenuRadioItem
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleCancel}
            className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Hủy đơn hàng</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
