'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/I18nNavigation';
import { Button, Badge } from '@/components/ui';
import { EmptyState, LoadingState } from '@/components/common';
import { FileText, CheckCircle2, Clock, AlertTriangle, XCircle, PenTool } from 'lucide-react';
import { DigitalSignatureCard } from './DigitalSignatureCard';
import type { EContractData } from '@/types';
import { formatVNDPrice } from '@/utils/formatters';

type ProfileContractsTabProps = {
  contractsLoading: boolean;
  contractsData: EContractData[];
  onOpenContractModal: (id: string) => void;
};

export const ProfileContractsTab = ({
  contractsLoading,
  contractsData,
  onOpenContractModal,
}: ProfileContractsTabProps) => {
  const t = useTranslations('contractsTab');
  const tCommon = useTranslations('actions');
  const tStatus = useTranslations('status');

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{t('title')}</h3>
        <p className="text-xs text-gray-400 font-medium">{t('subtitle')}</p>
      </div>

      {contractsLoading ? (
        <LoadingState variant="centered" message={tCommon('loading')} />
      ) : !contractsData || contractsData.length === 0 ? (
        <EmptyState
          title={t('noContracts')}
          description={t('noContracts')}
          icon={FileText}
        >
          <Button asChild variant="default" className="mt-2">
            <Link href="/products">{t('title')}</Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {contractsData.map((contract: EContractData) => {
            const status = (contract.status || '').toLowerCase();
            const isSigned = status === 'signed' || Boolean(contract.signedAt);
            const isDraft = status === 'draft' || status === 'pending_issue';
            const isPendingSign = status === 'pending' || status === 'pending_signature';

            const createdAtStr = contract.createdAt
              ? new Date(contract.createdAt).toLocaleDateString()
              : '—';
            const expiredAtStr = contract.expiredAt
              ? new Date(contract.expiredAt).toLocaleDateString()
              : '—';
            const contractVal = contract.contractValue ?? contract.totalAmount ?? contract.value ?? contract.order?.total ?? 0;

            return (
              <div
                key={contract.id}
                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                      {contract.title || t('contractCode', { code: contract.code || contract.id.slice(0, 8) })}
                    </span>
                    {isSigned ? (
                      <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-none font-bold text-xs inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{tStatus('signed')}</span>
                      </Badge>
                    ) : isDraft ? (
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none font-bold text-xs inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{tStatus('draft')}</span>
                      </Badge>
                    ) : status === 'expired' ? (
                      <Badge variant="secondary" className="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-none font-bold text-xs inline-flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>{tStatus('expired')}</span>
                      </Badge>
                    ) : status === 'cancelled' ? (
                      <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-none font-bold text-xs inline-flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                        <span>{tStatus('cancelled')}</span>
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-none font-bold text-xs inline-flex items-center gap-1 animate-pulse">
                        <PenTool className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{tStatus('pending')}</span>
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>{t('contractCode', { code: contract.code || contract.id.slice(0, 8) })}</span>
                    <span>{t('signedDate')} <strong className="text-slate-700 dark:text-slate-200">{createdAtStr}</strong></span>
                    {contract.expiredAt && (
                      <span>{t('status')} <strong className="text-slate-700 dark:text-slate-200">{expiredAtStr}</strong></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pt-0.5">
                    {t('contractValue')} <strong className="text-primary font-bold text-sm">{formatVNDPrice(Number(contractVal) || 0)}</strong>
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <Button
                    type="button"
                    variant={isPendingSign ? 'default' : 'outline'}
                    className={isPendingSign ? 'bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs' : ''}
                    onClick={() => onOpenContractModal(contract.id)}
                  >
                    {isSigned
                      ? t('viewContract')
                      : isDraft
                      ? t('viewContract')
                      : t('signNow')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Digital Signature Management Section */}
      <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
        <DigitalSignatureCard />
      </div>
    </div>
  );
};
