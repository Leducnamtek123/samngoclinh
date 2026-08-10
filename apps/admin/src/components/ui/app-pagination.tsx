"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { useTranslation } from "@/providers/i18n-provider"
import { Button } from "@/components/ui/button"

export interface PaginationMetadata {
  page?: number
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
  disabled?: boolean
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
  className?: string
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | "ellipsis")[] = []
  pages.push(1)

  if (currentPage > 3) {
    pages.push("ellipsis")
  }

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis")
  }

  if (!pages.includes(totalPages)) {
    pages.push(totalPages)
  }

  return pages
}

export function Pagination({
  metadata,
  page: directPage,
  perPage: directPerPage,
  totalItems: directTotalItems,
  totalPages: directTotalPages,
  disabled = false,
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

  const hasPrevious = metadata?.hasPrevious ?? (currentPage > 1)
  const hasNext = metadata?.hasNext ?? (currentPage < calculatedTotalPages)

  // Hide pagination if there are no items
  if (count === 0 && !metadata) {
    return null
  }

  const pages = getPageNumbers(currentPage, calculatedTotalPages || 1)
  const totalLabel = t("common.table.total")

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 items-center gap-4 px-6 py-4 border-t border-border bg-card/50 ${className}`}>
      {/* LEFT: Information / Count */}
      <div className="justify-self-center md:justify-self-start text-xs text-muted-foreground whitespace-nowrap">
        {t("common.table.pageOf", {
          page: currentPage,
          total: calculatedTotalPages || 1,
        })}{" "}
        ({count} {totalLabel})
      </div>

      {/* CENTER: Page numbers & Icons */}
      <div className="justify-self-center flex items-center gap-1.5">
        {/* Previous Button - Icon only */}
        <Button
          variant="outline"
          size="icon"
          disabled={!hasPrevious || currentPage <= 1 || disabled}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 w-8 rounded-lg shrink-0"
          aria-label={t("common.actions.previous")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Number Buttons */}
        {pages.map((p, index) => {
          if (p === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-1.5 text-xs text-muted-foreground select-none"
              >
                ...
              </span>
            )
          }

          const isSelected = p === currentPage
          return (
            <Button
              key={p}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              onClick={() => onPageChange(p)}
              className={`h-8 min-w-8 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                  : "border-input bg-background hover:bg-muted text-foreground"
              }`}
            >
              {p}
            </Button>
          )
        })}

        {/* Next Button - Icon only */}
        <Button
          variant="outline"
          size="icon"
          disabled={!hasNext || currentPage >= calculatedTotalPages || disabled}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 w-8 rounded-lg shrink-0"
          aria-label={t("common.actions.next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* RIGHT: Empty slot for 3-column symmetry */}
      <div className="hidden md:block justify-self-end" />
    </div>
  )
}

// Alias for convenience
export const AdminPagination = Pagination

