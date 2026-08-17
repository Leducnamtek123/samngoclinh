"use client"

import React from "react"

import type { TableMetadata } from "./data-table-pagination"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableEmpty } from "./data-table-empty"
import { DataTableLoading } from "./data-table-loading"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

export interface ColumnDef<T> {
  id?: string
  key?: string
  header: React.ReactNode
  cell: (item: T) => React.ReactNode
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  keyExtractor?: (item: T) => string
  loading?: boolean
  emptyMessage?: string
  metadata?: TableMetadata | null
  onPageChange?: (newPage: number) => void
  toolbarProps?: React.ComponentProps<typeof DataTableToolbar>
  rowActions?: (item: T) => React.ReactNode
  rowActionsHeader?: React.ReactNode
  containerClassName?: string
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor = (item: T) => {
    const record = item as unknown as Record<string, unknown>
    return String(record?.id || record?._id || record?.code || Math.random())
  },
  loading = false,
  emptyMessage = "Không có dữ liệu.",
  metadata,
  onPageChange,
  toolbarProps,
  rowActions,
  rowActionsHeader = "Actions",
  containerClassName = "",
}: DataTableProps<T>) {
  if (loading) {
    return <DataTableLoading cols={columns.length + (rowActions ? 1 : 0)} />
  }

  return (
    <div className={`space-y-4 ${containerClassName}`.trim()}>
      {toolbarProps && <DataTableToolbar {...toolbarProps} />}

      {data.length === 0 ? (
        <DataTableEmpty message={emptyMessage} />
      ) : (
        <div className="border border-border rounded-xl overflow-hidden shadow-xs bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {columns.map((col) => {
                  const colKey =
                    col.id ||
                    col.key ||
                    (typeof col.header === "string" ? col.header : "col-header")
                  return (
                    <TableHead
                      key={colKey}
                      className={col.headerClassName || ""}
                    >
                      {col.header}
                    </TableHead>
                  )
                })}
                {rowActions && (
                  <TableHead className="text-center">
                    {rowActionsHeader}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow
                  key={keyExtractor(item)}
                  className="hover:bg-muted/30"
                >
                  {columns.map((col) => {
                    const cellKey =
                      col.id ||
                      col.key ||
                      (typeof col.header === "string"
                        ? `${col.header}`
                        : "col-cell")
                    return (
                      <TableCell key={cellKey} className={col.className || ""}>
                        {col.cell(item)}
                      </TableCell>
                    )
                  })}
                  {rowActions && (
                    <TableCell className="text-center">
                      {rowActions(item)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {metadata && onPageChange && (
            <DataTablePagination
              metadata={metadata}
              onPageChange={onPageChange}
            />
          )}
        </div>
      )}
    </div>
  )
}
