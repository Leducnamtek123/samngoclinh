'use client';

import React from 'react';
import { PackageOpen, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  /** Title text or i18n string */
  title?: string;
  /** Description text explaining the empty state */
  description?: string;
  /** Optional icon component from lucide-react */
  icon?: LucideIcon;
  /** Label for the primary action button */
  actionLabel?: string;
  /** Callback function triggered when action button is clicked */
  onAction?: () => void;
  /** Action button variant */
  actionVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Additional custom class names */
  className?: string;
  /** Custom children elements to render below description */
  children?: React.ReactNode;
}

export function EmptyState({
  title = 'Không có dữ liệu',
  description = 'Chưa có thông tin hiển thị tại đây.',
  icon: Icon = PackageOpen,
  actionLabel,
  onAction,
  actionVariant = 'default',
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-card/50 my-4',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/80 text-muted-foreground mb-4">
        <Icon className="h-7 w-7 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {children}
      {actionLabel && onAction && (
        <Button variant={actionVariant} onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
