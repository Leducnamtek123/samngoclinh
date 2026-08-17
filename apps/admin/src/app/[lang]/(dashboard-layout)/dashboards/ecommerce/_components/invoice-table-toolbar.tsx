"use client"

import type { Table } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { InvoiceTableViewOptions } from "./invoice-table-view-options"

interface InvoiceTableToolbarProps<TTable> {
  table: Table<TTable>
}

export function InvoiceTableToolbar<TTable>({
  table,
}: InvoiceTableToolbarProps<TTable>) {
  return (
    <div className="flex gap-x-1.5">
      <InvoiceTableViewOptions table={table} />
      <Input
        placeholder="Tìm kiếm mã đơn hàng..."
        className="border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm"
        value={(table.getColumn("invoiceId")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("invoiceId")?.setFilterValue(event.target.value)
        }
      />
    </div>
  )
}
