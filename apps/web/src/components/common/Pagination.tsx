'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  disabled?: boolean;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  pages.push(1);

  if (currentPage > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis');
  }

  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  disabled = false,
  className,
}: PaginationProps) {
  if (totalPages <= 0) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 items-center gap-4 px-6 py-4 border-t border-border bg-card/50', className)}>
      {/* LEFT: Info */}
      <div className="justify-self-center md:justify-self-start text-xs text-muted-foreground whitespace-nowrap">
        Trang <span className="font-semibold text-foreground">{currentPage}</span> trên{' '}
        <span className="font-semibold text-foreground">{totalPages}</span>
        {totalRecords !== undefined && ` (${totalRecords} tổng số)`}
      </div>

      {/* CENTER: Page numbers */}
      <div className="justify-self-center flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg shrink-0"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious || disabled}
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p, index) => {
          if (p === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="px-1.5 text-xs text-muted-foreground select-none">
                ...
              </span>
            );
          }

          const isSelected = p === currentPage;
          return (
            <Button
              key={p}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              disabled={disabled}
              onClick={() => onPageChange(p)}
              className={cn(
                'h-8 min-w-8 px-2.5 rounded-lg text-xs font-semibold transition-all',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'
                  : 'border-input bg-background hover:bg-muted text-foreground'
              )}
            >
              {p}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg shrink-0"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext || disabled}
          aria-label="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* RIGHT: Empty slot */}
      <div className="hidden md:block justify-self-end" />
    </div>
  );
}

