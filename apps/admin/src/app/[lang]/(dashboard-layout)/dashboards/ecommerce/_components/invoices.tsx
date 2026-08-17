import type { Order } from "@/types"
import type { InvoiceType } from "../types"

import { InvoicesTable } from "./invoices-table"

interface InvoicesProps {
  orders?: Order[] | null
}

function mapOrderStatusToDelivery(
  status?: string
): InvoiceType["deliveryStatus"] {
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
      : []

  return (
    <article className="col-span-full">
      <InvoicesTable data={formattedInvoices} />
    </article>
  )
}
