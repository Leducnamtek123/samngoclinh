'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  /** Optional message displayed next to or below spinner */
  message?: string;
  /** Size of the spinner: sm (16px), md (24px), lg (36px), xl (48px) */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Display layout variant: inline (horizontal), centered (vertical block), overlay (full container screen) */
  variant?: 'inline' | 'centered' | 'overlay';
  /** Additional custom container styling */
  className?: string;
}

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-9 w-9',
  xl: 'h-12 w-12',
};

export function LoadingState({
  message = 'Đang tải...',
  size = 'md',
  variant = 'centered',
  className,
}: LoadingStateProps) {
  if (variant === 'inline') {
    return (
      <div className={cn('inline-flex items-center gap-2 text-muted-foreground text-sm', className)}>
        <Loader2 className={cn('animate-spin shrink-0 text-primary', iconSizes[size])} />
        {message && <span>{message}</span>}
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className={cn('absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-4', className)}>
        <Loader2 className={cn('animate-spin text-primary mb-2', iconSizes[size])} />
        {message && <p className="text-sm font-medium text-muted-foreground">{message}</p>}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 min-h-[160px] w-full text-center', className)}>
      <Loader2 className={cn('animate-spin text-primary mb-3', iconSizes[size])} />
      {message && <p className="text-sm font-medium text-muted-foreground">{message}</p>}
    </div>
  );
}
