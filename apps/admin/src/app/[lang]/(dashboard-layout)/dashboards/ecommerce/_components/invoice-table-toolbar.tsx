"use client"

import type { Table } from "@tanstack/react-table"

import { useTranslation } from "@/providers/i18n-provider"
import { Input } from "@/components/ui/input"
import { InvoiceTableViewOptions } from "./invoice-table-view-options"

interface InvoiceTableToolbarProps<TTable> {
  table: Table<TTable>
}

export function InvoiceTableToolbar<TTable>({
  table,
}: InvoiceTableToolbarProps<TTable>) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-x-1.5">
      <InvoiceTableViewOptions table={table} />
      <Input
        placeholder={t("search.searchPlaceholder")}
        className="border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm"
        value={(table.getColumn("invoiceId")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("invoiceId")?.setFilterValue(event.target.value)
        }
      />
    </div>
  )
}
