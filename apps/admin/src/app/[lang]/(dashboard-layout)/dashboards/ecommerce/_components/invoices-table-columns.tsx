"use client"

import { Clock, Package, PackageCheck, Plane, Truck } from "lucide-react"

import type { ColumnDef } from "@tanstack/react-table"
import type { InvoiceType } from "../types"

import { formatCurrency, formatDate } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { InvoiceTableRowActions } from "./invoice-table-row-actions"

const defaultDeliveryStatusConfig: Record<
  InvoiceType["deliveryStatus"],
  { label: string; icon: typeof Clock; className: string }
> = {
  Delivered: {
    label: "Đã giao hàng",
    icon: PackageCheck,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  Shipped: {
    label: "Đang giao hàng",
    icon: Truck,
    className:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300",
  },
  "In Transit": {
    label: "Đang vận chuyển",
    icon: Plane,
    className:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300",
  },
  Processing: {
    label: "Đang xử lý",
    icon: Package,
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
  },
  Pending: {
    label: "Chờ xử lý",
    icon: Clock,
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
  },
}

export function getInvoicesTableColumns(
  t?: (key: string) => string
): ColumnDef<InvoiceType>[] {
  const deliveryStatusConfig: Record<
    InvoiceType["deliveryStatus"],
    { label: string; icon: typeof Clock; className: string }
  > = t
    ? {
        Delivered: {
          label: t("orders.deliveryStatus.Delivered"),
          icon: PackageCheck,
          className:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        },
        Shipped: {
          label: t("orders.deliveryStatus.Shipped"),
          icon: Truck,
          className:
            "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300",
        },
        "In Transit": {
          label: t("orders.deliveryStatus.In Transit"),
          icon: Plane,
          className:
            "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300",
        },
        Processing: {
          label: t("orders.deliveryStatus.Processing"),
          icon: Package,
          className:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
        },
        Pending: {
          label: t("orders.deliveryStatus.Pending"),
          icon: Clock,
          className:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        },
      }
    : defaultDeliveryStatusConfig

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          className="ms-4"
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          className="ms-4"
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "invoiceId",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t ? t("orders.fields.orderCode") : "Mã Đơn Hàng"}
        />
      ),
      cell: ({ row }) => {
        const invoiceId = row.getValue("invoiceId") as string

        return (
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
            #{invoiceId}
          </span>
        )
      },
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t ? t("orders.fields.customer") : "Khách Hàng"}
        />
      ),
      cell: ({ row }) => {
        const customerName = row.getValue("customerName") as string

        return (
          <span className="inline-block max-w-44 break-all truncate font-medium text-slate-800 dark:text-slate-200">
            {customerName}
          </span>
        )
      },
    },
    {
      accessorKey: "orderDate",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t ? t("orders.fields.orderDate") : "Ngày Đặt"}
        />
      ),
      cell: ({ row }) => {
        const orderDate = row.getValue("orderDate") as string

        return (
          <span className="text-muted-foreground">{formatDate(orderDate)}</span>
        )
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t ? t("orders.fields.orderDate") : "Hạn Xử Lý"}
        />
      ),
      cell: ({ row }) => {
        const dueDate = row.getValue("dueDate") as string

        return (
          <span className="text-muted-foreground">{formatDate(dueDate)}</span>
        )
      },
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t ? t("orders.fields.totalAmount") : "Tổng Tiền"}
        />
      ),
      cell: ({ row }) => {
        const totalAmount = row.getValue("totalAmount") as number

        return (
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {formatCurrency(totalAmount)}
          </span>
        )
      },
    },
    {
      accessorKey: "deliveryStatus",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={
            t ? t("orders.fields.deliveryStatus") : "Trạng Thái Vận Chuyển"
          }
        />
      ),
      cell: ({ row }) => {
        const deliveryStatus = (row.getValue("deliveryStatus") ||
          "Pending") as InvoiceType["deliveryStatus"]
        const config =
          deliveryStatusConfig[deliveryStatus] || deliveryStatusConfig.Pending
        const Icon = config.icon

        return (
          <Badge
            variant="outline"
            className={`font-semibold px-2.5 py-0.5 border ${config.className}`}
          >
            <Icon className="me-1.5 h-3.5 w-3.5" />
            <span>{config.label}</span>
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: () => (
        <span className="sr-only">
          {t ? t("common.actions.actions") : "Thao tác"}
        </span>
      ),
      cell: ({ row }) => <InvoiceTableRowActions row={row} />,
    },
  ]
}

export const invoicesTableColumns = getInvoicesTableColumns()
