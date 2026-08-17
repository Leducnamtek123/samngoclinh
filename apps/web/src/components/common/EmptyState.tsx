'use client';

import type { LucideIcon } from 'lucide-react';
import { PackageOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type EmptyStateProps = {
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
};

export function EmptyState({
  title,
  description,
  icon: Icon = PackageOpen,
  actionLabel,
  onAction,
  actionVariant = 'default',
  className,
  children,
}: EmptyStateProps) {
  const t = useTranslations('emptyState');
  const resolvedTitle = title || t('title');
  const resolvedDesc = description === undefined ? t('description') : description;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-card/50 my-4',
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted/80 text-muted-foreground">
        <Icon className="h-7 w-7 stroke-[1.5]" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-foreground">{resolvedTitle}</h3>
      {resolvedDesc && (
        <p className="mb-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {resolvedDesc}
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
