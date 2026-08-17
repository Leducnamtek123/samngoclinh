'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ErrorStateProps = {
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
};

export function ErrorState({
  title,
  message,
  description,
  onRetry,
  retryLabel,
  className,
}: ErrorStateProps) {
  const t = useTranslations('errorState');
  const displayTitle = title || t('title');
  const displayDescription = description || message || t('description');
  const displayRetryLabel = retryLabel || t('retry');

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-destructive/20 bg-destructive/5 my-4',
        className,
      )}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-foreground">{displayTitle}</h3>
      {displayDescription && (
        <p className="mb-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {displayDescription}
        </p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1 gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          {displayRetryLabel}
        </Button>
      )}
    </div>
  );
}
