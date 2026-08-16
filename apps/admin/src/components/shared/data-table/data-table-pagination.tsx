"use client"

import React from "react"

import { Pagination } from "@/components/ui/app-pagination"

export interface TableMetadata {
  page: number
  perPage: number
  totalPage: number
  count?: number
  totalData?: number
  hasNext: boolean
  hasPrevious: boolean
}

interface DataTablePaginationProps {
  metadata: TableMetadata | null
  onPageChange: (newPage: number) => void
  pageSizeOptions?: number[]
}

export function DataTablePagination({
  metadata,
  onPageChange,
}: DataTablePaginationProps) {
  if (!metadata || metadata.totalPage <= 1) return null

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-xs text-muted-foreground">
        Trang {metadata.page} / {metadata.totalPage} (Tổng: {metadata.count ?? metadata.totalData ?? 0})
      </div>
      <Pagination
        page={metadata.page}
        totalPages={metadata.totalPage}
        onPageChange={onPageChange}
      />
    </div>
  )
}
