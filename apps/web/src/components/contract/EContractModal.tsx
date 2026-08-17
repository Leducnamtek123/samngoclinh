'use client';

import {
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  PenTool,
  ShieldCheck,
  Clock,
  Download,
  Search,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { LoadingState } from '@/components/common/LoadingState';
import { Button } from '@/components/ui/button';
import { formatVNDPrice } from '@/utils/formatters';
import { EContractDocumentView } from './EContractDocumentView';
import { EContractSignaturePad } from './EContractSignaturePad';
import { useEContractModal } from './useEContractModal';

type EContractModalProps = {
  contractId: string | null;
  onClose: () => void;
};

export const EContractModal: React.FC<EContractModalProps> = ({ contractId, onClose }) => {
  const t = useTranslations('econtract');
  const tActions = useTranslations('actions');
  const modal = useEContractModal({ contractId });

  if (!contractId) {
    return null;
  }

  return (
    <div
      data-lenis-prevent
      className="animate-fade-in fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-xs transition-opacity duration-200 sm:p-4"
    >
      <div
        data-lenis-prevent
        className="flex max-h-[88vh] w-full max-w-3xl shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card bg-white text-card-foreground shadow-xl dark:bg-slate-900"
      >
        {/* Sticky Header */}
        <div className="z-10 flex shrink-0 items-center justify-between rounded-t-[20px] border-b border-slate-800 bg-slate-900 px-6 py-5 text-white shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-2.5 text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base leading-snug font-extrabold">
                {t('title')} #{modal.contract?.code || contractId.slice(0, 8)}
              </h3>
              <p className="text-xs font-medium text-slate-400">{t('subtitle')}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={t('close')}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content Body Inner Scroll Area */}
        <div
          data-lenis-prevent
          className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-6"
        >
          {modal.isLoading ? (
            <div className="py-20">
              <LoadingState message={t('loadingContract')} />
            </div>
          ) : modal.isError || !modal.contract ? (
            <div className="space-y-2 rounded-2xl bg-red-50 p-6 py-12 text-center font-medium text-red-700">
              <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
              <p>{tActions('error')}</p>
            </div>
          ) : (
            <>
              {/* Contract Metadata Banner */}
              {(() => {
                const status = (modal.contract.status || '').toLowerCase();
                const isDraft = status === 'draft' || status === 'pending_issue';
                const isExpired = status === 'expired';
                const rawVal =
                  modal.contract.contractValue ??
                  modal.contract.totalAmount ??
                  modal.contract.value ??
                  modal.contract.order?.total ??
                  0;
                const contractValueNum = Number(rawVal) || 0;

                return (
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase">
                        {t('status')}
                      </span>
                      <div className="flex items-center gap-2">
                        {modal.isSigned ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                            <CheckCircle2 className="h-4 w-4" /> {t('signed')}
                          </span>
                        ) : isDraft ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                            <Clock className="h-4 w-4" /> {t('draft')}
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                            <AlertCircle className="h-4 w-4" /> {t('expired')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-xs">
                            <PenTool className="h-4 w-4" /> {t('pendingSign')}
                          </span>
                        )}
                        <span className="text-xs font-medium text-slate-500">
                          •{' '}
                          {t('createdDate', {
                            date: modal.contract.createdAt
                              ? new Date(modal.contract.createdAt).toLocaleDateString('vi-VN', {
                                  timeZone: 'Asia/Ho_Chi_Minh',
                                })
                              : '—',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-xs font-semibold text-slate-500">
                        {t('contractValue')}
                      </span>
                      <span className="text-lg font-black text-primary">
                        {formatVNDPrice(contractValueNum)}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Contract Document Text Container */}
              <EContractDocumentView contract={modal.contract} />

              {/* Signature Section */}
              {modal.isSigned ? (
                <div className="space-y-4">
                  <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">{t('legalEffective')}</h5>
                        <p className="text-xs text-slate-500">
                          {t('signedAt', {
                            time: modal.contract.signedAt
                              ? new Date(modal.contract.signedAt).toLocaleString('vi-VN', {
                                  timeZone: 'Asia/Ho_Chi_Minh',
                                })
                              : 'Done',
                          })}
                        </p>
                      </div>
                    </div>

                    {modal.contract.userSignatureUrl && (
                      <div className="shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-center">
                        <Image
                          src={modal.contract.userSignatureUrl}
                          alt="Signature"
                          width={120}
                          height={48}
                          unoptimized
                          className="mx-auto h-12 w-auto object-contain"
                        />
                        <span className="block text-[10px] font-semibold text-slate-400">
                          {t('digitalSignature')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={`/api/proxy/public/contracts/pdf?code=${encodeURIComponent(modal.contract.code)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-emerald-800"
                    >
                      <Download className="h-4 w-4 shrink-0" />
                      <span>{t('downloadPdf')}</span>
                    </a>
                    <a
                      href={`/vi/trace/contract/${modal.contract.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <Search className="h-4 w-4 shrink-0" />
                      <span>{t('verifyCertificate')}</span>
                    </a>
                  </div>
                </div>
              ) : (modal.contract?.status || '').toLowerCase() === 'draft' ||
                (modal.contract?.status || '').toLowerCase() === 'pending_issue' ? (
                <div className="flex items-center gap-4 rounded-2xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-800 dark:bg-purple-950/40">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {t('draftProcessingTitle')}
                    </h5>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                      {t('draftProcessingDesc')}
                    </p>
                  </div>
                </div>
              ) : (
                <EContractSignaturePad
                  signatureType={modal.signatureType}
                  setSignatureType={modal.setSignatureType}
                  savedSignatureUrl={modal.savedSignatureUrl}
                  typedName={modal.typedName}
                  setTypedName={modal.setTypedName}
                  errorMessage={modal.errorMessage}
                  canvasRef={modal.canvasRef}
                  hasCanvasDrawn={modal.hasCanvasDrawn}
                  startDrawing={modal.startDrawing}
                  stopDrawing={modal.stopDrawing}
                  draw={modal.draw}
                  clearCanvas={modal.clearCanvas}
                />
              )}
            </>
          )}
        </div>

        {/* Sticky Footer Actions */}
        <div className="z-10 flex shrink-0 items-center justify-between gap-4 rounded-b-[20px] border-t border-slate-200 bg-slate-50 px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-auto rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
          >
            {t('close')}
          </Button>

          {!modal.isSigned &&
            modal.contract &&
            (modal.contract.status || '').toLowerCase() !== 'draft' &&
            (modal.contract.status || '').toLowerCase() !== 'pending_issue' && (
              <Button
                type="button"
                onClick={modal.handleSign}
                disabled={modal.signMutation.isPending}
                isLoading={modal.signMutation.isPending}
                className="flex h-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-hover active:bg-primary/80"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{t('confirmSign')}</span>
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};
