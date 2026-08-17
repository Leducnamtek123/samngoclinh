'use client';

import { FileText, CheckCircle2, Clock, AlertTriangle, XCircle, PenTool } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { EmptyState, LoadingState } from '@/components/common';
import { Button, Badge } from '@/components/ui';
import { Link } from '@/lib/I18nNavigation';
import type { EContractData } from '@/types';
import { formatVNDPrice } from '@/utils/formatters';
import { DigitalSignatureCard } from './DigitalSignatureCard';

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
        <p className="text-xs font-medium text-gray-400">{t('subtitle')}</p>
      </div>

      {contractsLoading ? (
        <LoadingState variant="centered" message={tCommon('loading')} />
      ) : !contractsData || contractsData.length === 0 ? (
        <EmptyState title={t('noContracts')} description={t('noContracts')} icon={FileText}>
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
            const contractVal =
              contract.contractValue ??
              contract.totalAmount ??
              contract.value ??
              contract.order?.total ??
              0;

            return (
              <div
                key={contract.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-shadow duration-200 hover:shadow-md sm:flex-row sm:items-center dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {contract.title ||
                        t('contractCode', { code: contract.code || contract.id.slice(0, 8) })}
                    </span>
                    {isSigned ? (
                      <Badge
                        variant="secondary"
                        className="inline-flex items-center gap-1 border-none bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{tStatus('signed')}</span>
                      </Badge>
                    ) : isDraft ? (
                      <Badge
                        variant="secondary"
                        className="inline-flex items-center gap-1 border-none bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                        <span>{tStatus('draft')}</span>
                      </Badge>
                    ) : status === 'expired' ? (
                      <Badge
                        variant="secondary"
                        className="inline-flex items-center gap-1 border-none bg-rose-100 text-xs font-bold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
                        <span>{tStatus('expired')}</span>
                      </Badge>
                    ) : status === 'cancelled' ? (
                      <Badge
                        variant="secondary"
                        className="inline-flex items-center gap-1 border-none bg-gray-100 text-xs font-bold text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      >
                        <XCircle className="h-3.5 w-3.5 shrink-0 text-gray-600" />
                        <span>{tStatus('cancelled')}</span>
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="inline-flex animate-pulse items-center gap-1 border-none bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      >
                        <PenTool className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                        <span>{tStatus('pending')}</span>
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span>
                      {t('contractCode', { code: contract.code || contract.id.slice(0, 8) })}
                    </span>
                    <span>
                      {t('signedDate')}{' '}
                      <strong className="text-slate-700 dark:text-slate-200">{createdAtStr}</strong>
                    </span>
                    {contract.expiredAt && (
                      <span>
                        {t('status')}{' '}
                        <strong className="text-slate-700 dark:text-slate-200">
                          {expiredAtStr}
                        </strong>
                      </span>
                    )}
                  </div>
                  <p className="pt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {t('contractValue')}{' '}
                    <strong className="text-sm font-bold text-primary">
                      {formatVNDPrice(Number(contractVal) || 0)}
                    </strong>
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <Button
                    type="button"
                    variant={isPendingSign ? 'default' : 'outline'}
                    className={
                      isPendingSign
                        ? 'bg-emerald-700 font-bold text-white shadow-xs hover:bg-emerald-800'
                        : ''
                    }
                    onClick={() => {
                      onOpenContractModal(contract.id);
                    }}
                  >
                    {isSigned ? t('viewContract') : isDraft ? t('viewContract') : t('signNow')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Digital Signature Management Section */}
      <div className="border-t border-gray-100 pt-6 dark:border-gray-800">
        <DigitalSignatureCard />
      </div>
    </div>
  );
};
