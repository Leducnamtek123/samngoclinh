'use client';

import { History, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { KycDocTypeBadge } from './KycDocTypeBadge';
import type { KycHistoryItem } from './types';

type KycHistoryListProps = {
  historyList: KycHistoryItem[];
  formatDate: (d?: string) => string;
};

export function KycHistoryList({ historyList, formatDate }: KycHistoryListProps) {
  const t = useTranslations('kyc');
  if (historyList.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 border-t border-slate-200/80 pt-6 dark:border-slate-800">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
        <History className="h-4 w-4 text-emerald-600" />
        <span>
          {t('historyTitle')} ({historyList.length})
        </span>
      </div>

      <div className="space-y-3">
        {historyList.map((item, idx) => {
          const isItemApproved = item.status === 'APPROVED';
          const isItemRejected = item.status === 'REJECTED';
          return (
            <div
              key={item.id || `${item.documentType}-${item.createdAt || 'kyc'}`}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 text-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {t('attempt', { index: historyList.length - idx })}
                  </span>
                  <KycDocTypeBadge type={item.documentType} />
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      isItemApproved
                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                        : isItemRejected
                          ? 'border border-rose-200 bg-rose-50 text-rose-700'
                          : 'border border-amber-200 bg-amber-50 text-amber-700'
                    }`}
                  >
                    {isItemApproved ? t('verified') : isItemRejected ? t('rejected') : t('pending')}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-medium text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(item.createdAt)}</span>
                  {item.idCardNumber && (
                    <span>
                      {t('documentNumber')}:{' '}
                      <strong className="font-mono text-slate-700 dark:text-slate-300">
                        {item.idCardNumber}
                      </strong>
                    </span>
                  )}
                </div>

                {isItemRejected && item.rejectionReason && (
                  <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                    {t('rejectReason')}: {item.rejectionReason}
                  </p>
                )}
                {item.adminNote && !isItemRejected && (
                  <p className="text-xs text-slate-500">{item.adminNote}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
