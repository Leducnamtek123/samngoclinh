import type { InvoiceType } from "../types"
import type { Order } from "@/types"

import { InvoicesTable } from "./invoices-table"

interface InvoicesProps {
  orders?: Order[] | null
}

const DEFAULT_INVOICES: InvoiceType[] = [
  {
    invoiceId: "INV-SNL-1001",
    customerName: "Nguyễn Văn Hùng",
    orderDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 12 * 86400000).toISOString(),
    totalAmount: 15500000,
    deliveryStatus: "Delivered",
  },
  {
    invoiceId: "INV-SNL-1002",
    customerName: "Trần Thị Mai",
    orderDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 9 * 86400000).toISOString(),
    totalAmount: 48000000,
    deliveryStatus: "Shipped",
  },
  {
    invoiceId: "INV-SNL-1003",
    customerName: "Lê Hoàng Phúc",
    orderDate: new Date(Date.now() - 8 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 6 * 86400000).toISOString(),
    totalAmount: 32000000,
    deliveryStatus: "Pending",
  },
  {
    invoiceId: "INV-SNL-1004",
    customerName: "Phạm Minh Tâm",
    orderDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    totalAmount: 8500000,
    deliveryStatus: "In Transit",
  },
  {
    invoiceId: "INV-SNL-1005",
    customerName: "Đỗ Thành Long",
    orderDate: new Date(Date.now() - 12 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    totalAmount: 65000000,
    deliveryStatus: "Processing",
  },
]

function mapOrderStatusToDelivery(status?: string): InvoiceType["deliveryStatus"] {
  switch (status?.toLowerCase()) {
    case "completed":
    case "delivered":
      return "Delivered"
    case "shipping":
    case "shipped":
      return "Shipped"
    case "processing":
      return "Processing"
    case "in_transit":
      return "In Transit"
    default:
      return "Pending"
  }
}

export function Invoices({ orders }: InvoicesProps) {
  const formattedInvoices: InvoiceType[] =
    orders && orders.length > 0
      ? orders.map((o) => ({
          invoiceId: o.code || `INV-${o.id.substring(0, 6)}`,
          customerName: o.customerName || "Khách hàng Sâm Ngọc Linh",
          orderDate: o.createdAt || new Date().toISOString(),
          dueDate: o.completedAt || new Date().toISOString(),
          totalAmount: o.total || 0,
          deliveryStatus: mapOrderStatusToDelivery(o.status),
        }))
      : DEFAULT_INVOICES

  return (
    <article className="col-span-full">
      <InvoicesTable data={formattedInvoices} />
    </article>
  )
}
