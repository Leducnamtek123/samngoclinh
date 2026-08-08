"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { useTranslation } from "@/providers/i18n-provider"
import { Button } from "@/components/ui/button"

export interface PaginationMetadata {
  page: number
  perPage?: number
  pageSize?: number
  totalPage?: number
  totalPages?: number
  count?: number
  total?: number
  hasNext?: boolean
  hasPrevious?: boolean
}

export interface PaginationProps {
  metadata?: PaginationMetadata | null
  page?: number
  perPage?: number
  totalItems?: number
  totalPages?: number
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
  className?: string
}

export function Pagination({
  metadata,
  page: directPage,
  perPage: directPerPage,
  totalItems: directTotalItems,
  totalPages: directTotalPages,
  onPageChange,
  onPerPageChange,
  className = "",
}: PaginationProps) {
  const { t } = useTranslation()

  // Calculate actual values using metadata or direct props
  const currentPage = metadata?.page ?? directPage ?? 1
  const currentPerPage = metadata?.perPage ?? metadata?.pageSize ?? directPerPage ?? 10
  const count = metadata?.count ?? metadata?.total ?? directTotalItems ?? 0
  const calculatedTotalPages =
    metadata?.totalPage ??
    metadata?.totalPages ??
    directTotalPages ??
    (count > 0 ? Math.ceil(count / currentPerPage) : 1)

  const hasPrevious =
    metadata?.hasPrevious ?? (currentPage > 1)
  const hasNext =
    metadata?.hasNext ?? (currentPage < calculatedTotalPages)

  // Hide pagination if there are no items
  if (count === 0 && !metadata) {
    return null
  }

  return (
    <div className={`mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${className}`}>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {t("common.table.pageOf", {
          page: currentPage,
          total: calculatedTotalPages || 1,
        })}{" "}
        ({count} {t("common.actions.actions") === "Hành động" ? "tổng số" : "total"})
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevious || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>{t("common.actions.previous")}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext || currentPage >= calculatedTotalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400"
        >
          <span>{t("common.actions.next")}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

// Alias for convenience
export const AdminPagination = Pagination
