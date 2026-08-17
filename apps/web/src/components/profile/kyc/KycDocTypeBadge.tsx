'use client';

import { CreditCard, Globe, Car } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function KycDocTypeBadge({ type }: { type?: string }) {
  const t = useTranslations('kyc');

  switch (type) {
    case 'passport': {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
          <Globe className="h-3.5 w-3.5 text-indigo-600" />
          {t('docTypes.passport')}
        </span>
      );
    }
    case 'driver_license': {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300">
          <Car className="h-3.5 w-3.5 text-sky-600" />
          {t('docTypes.driverLicense')}
        </span>
      );
    }
    default: {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
          <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
          {t('docTypes.cccd')}
        </span>
      );
    }
  }
}
