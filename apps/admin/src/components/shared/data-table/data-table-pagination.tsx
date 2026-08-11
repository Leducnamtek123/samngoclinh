"use client"

import React from "react"
import { Pagination } from "@/components/ui/app-pagination"

export interface TableMetadata {
  page: number
  perPage: number
  totalPage: number
  count: number
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
  if (!metadata) return null

  return <Pagination metadata={metadata} onPageChange={onPageChange} />
}
