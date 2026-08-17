'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import type { AddressItem } from '@/types';

export type AddressCardItemProps = {
  address: AddressItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  defaultBadgeLabel?: string;
  className?: string;
};

export function AddressCardItem({
  address,
  isSelected,
  onSelect,
  defaultBadgeLabel,
  className = '',
}: AddressCardItemProps) {
  const t = useTranslations('addressSelector');
  const defaultBadge = defaultBadgeLabel || t('defaultBadge');
  const recipient = address.recipient || address.name || t('defaultRecipient');
  const phone = address.phone || '';
  const detail = address.detail || address.address || '';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        onSelect(address.id);
      }}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(address.id)}
      className={`flex cursor-pointer items-start justify-between rounded-xl border p-4 transition-[border-color,background-color,box-shadow] ${
        isSelected
          ? 'border-primary bg-emerald-50/60 ring-2 ring-primary/20 dark:bg-emerald-950/40'
          : 'border-gray-200 bg-white hover:border-emerald-300 dark:border-gray-800 dark:bg-slate-900 dark:hover:border-emerald-700'
      } ${className}`}
    >
      <div className="space-y-1 pr-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{recipient}</span>
          {phone && <span className="text-xs font-medium text-gray-500">· {phone}</span>}
          {address.isDefault && (
            <Badge
              variant="secondary"
              className="border-none bg-emerald-100 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
            >
              {defaultBadge}
            </Badge>
          )}
        </div>
        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{detail}</p>
      </div>

      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          isSelected
            ? 'border-primary bg-primary text-white'
            : 'border-gray-300 dark:border-gray-700'
        }`}
      >
        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
      </div>
    </div>
  );
}
