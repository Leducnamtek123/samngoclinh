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
      onClick={() => onSelect(address.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(address.id)}
      className={`p-4 rounded-xl border flex items-start justify-between cursor-pointer transition-[border-color,background-color,box-shadow] ${
        isSelected
          ? 'border-primary bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-primary/20'
          : 'border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900'
      } ${className}`}
    >
      <div className="space-y-1 pr-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
            {recipient}
          </span>
          {phone && (
            <span className="text-xs text-gray-500 font-medium">
              · {phone}
            </span>
          )}
          {address.isDefault && (
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold border-none text-[10px]"
            >
              {defaultBadge}
            </Badge>
          )}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          {detail}
        </p>
      </div>

      <div
        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
          isSelected
            ? 'border-primary bg-primary text-white'
            : 'border-gray-300 dark:border-gray-700'
        }`}
      >
        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
    </div>
  );
}
