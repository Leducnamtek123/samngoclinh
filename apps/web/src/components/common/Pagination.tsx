'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  /** Current active page (1-based index) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback fired when page number changes */
  onPageChange: (page: number) => void;
  /** Optional total records count to display */
  totalRecords?: number;
  /** Additional container styling */
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 py-4', className)}>
      {totalRecords !== undefined && (
        <p className="text-sm text-muted-foreground">
          Hiển thị trang <span className="font-medium text-foreground">{currentPage}</span> /{' '}
          <span className="font-medium text-foreground">{totalPages}</span> ({totalRecords} kết quả)
        </p>
      )}

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious}
          aria-label="First Page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium px-3 py-1">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          aria-label="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          aria-label="Last Page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
