'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ErrorStateProps {
  /** Error message or title */
  title?: string;
  /** Alias for description */
  message?: string;
  /** Detailed error message */
  description?: string;
  /** Retry callback function */
  onRetry?: () => void;
  /** Custom retry button label */
  retryLabel?: string;
  /** Additional CSS class names */
  className?: string;
}

export function ErrorState({
  title = 'Đã xảy ra lỗi',
  message,
  description = message || 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
  onRetry,
  retryLabel = 'Thử lại',
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-destructive/20 bg-destructive/5 my-4',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 mt-1">
          <RefreshCw className="h-3.5 w-3.5" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
