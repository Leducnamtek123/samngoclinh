'use client';

import React from 'react';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyTitle,
  emptyDescription,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingState message="Đang tải danh sách..." />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-border bg-card', className)}>
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={cn('px-4 py-3 font-semibold', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item, index) => (
            <tr key={keyExtractor(item, index)} className="hover:bg-muted/30 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-3.5 align-middle', col.className)}>
                  {col.cell(item, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
