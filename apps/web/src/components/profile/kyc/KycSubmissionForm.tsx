'use client';

import { AlertOctagon, AlertTriangle, Check, Info, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Button } from '@/components/ui/button';
import { KycPhotoUploadDropzone } from './KycPhotoUploadDropzone';
import type { DocumentOption, IdentityDocumentType, KycSubmissionData } from './types';

export type KycSubmissionFormProps = {
  isRejected: boolean;
  isReuploadMode: boolean;
  actualKycData: KycSubmissionData | null;
  documentType: IdentityDocumentType;
  setDocumentType: (val: IdentityDocumentType) => void;
  setKycErrorMsg: (val: string) => void;
  idCardNumber: string;
  setIdCardNumber: (val: string) => void;
  fullName: string;
  setFullName: (val: string) => void;
  activeOption: DocumentOption;
  kycErrorMsg: string;
  frontImagePreview: string;
  backImagePreview: string;
  existingFront: string;
  existingBack: string;
  frontFileRef: React.MutableRefObject<File | null>;
  backFileRef: React.MutableRefObject<File | null>;
  setFrontImagePreview: (val: string) => void;
  setBackImagePreview: (val: string) => void;
  setIsReuploadMode: (val: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  documentOptions: DocumentOption[];
};

export function KycSubmissionForm({
  isRejected,
  isReuploadMode,
  actualKycData,
  documentType,
  setDocumentType,
  setKycErrorMsg,
  idCardNumber,
  setIdCardNumber,
  fullName,
  setFullName,
  activeOption,
  kycErrorMsg,
  frontImagePreview,
  backImagePreview,
  existingFront,
  existingBack,
  frontFileRef,
  backFileRef,
  setFrontImagePreview,
  setBackImagePreview,
  setIsReuploadMode,
  handleSubmit,
  isSubmitting,
  documentOptions,
}: KycSubmissionFormProps) {
  const t = useTranslations('kyc');
  const tActions = useTranslations('actions');

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isRejected && !isReuploadMode && (
        <div className="flex items-start gap-4 rounded-2xl border border-rose-200 bg-rose-50/70 p-5 dark:border-rose-900 dark:bg-rose-950/30">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400">
            <AlertOctagon className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-1.5 text-xs">
            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              {t('rejectedTitle')}
            </h4>
            <div className="rounded-xl border border-rose-200 bg-white/80 p-3 font-medium text-rose-800 dark:border-rose-900 dark:bg-slate-900/80 dark:text-rose-300">
              <span className="mb-0.5 block font-bold text-rose-900 dark:text-rose-200">
                {t('rejectionReason')}
              </span>
              {actualKycData?.rejectionReason || t('guide2')}
            </div>
            <p className="pt-1 font-medium text-slate-600 dark:text-slate-400">{t('guide1')}</p>
          </div>
        </div>
      )}

      {/* Step 1: Select Document Type */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800 text-[11px] font-bold text-white">
              1
            </span>
            {t('selectDocType')}
          </span>
          <span className="text-xs font-medium text-slate-400">*</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {documentOptions.map((opt) => {
            const isSelected = documentType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setDocumentType(opt.value);
                  setKycErrorMsg('');
                }}
                className={`relative flex min-h-[120px] cursor-pointer flex-col justify-between rounded-2xl border p-5 text-left transition-[border-color,background-color,box-shadow] ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 shadow-xs ring-2 ring-emerald-600/20 dark:bg-emerald-950/30 dark:text-slate-100'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex w-full items-start justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-sm font-bold uppercase">{opt.value.slice(0, 4)}</span>
                  </div>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                    {opt.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {opt.frontDescription}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Document Details Input */}
      <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <span className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800 text-[11px] font-bold text-white">
            2
          </span>
          {t('enterDocInfo')}
        </span>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="kyc-id-card-number"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {activeOption.frontTitle} <span className="text-rose-500">*</span>
            </label>
            <input
              id="kyc-id-card-number"
              type="text"
              value={idCardNumber}
              onChange={(e) => {
                setIdCardNumber(e.target.value);
              }}
              placeholder="001200000000"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-mono text-sm font-semibold text-slate-900 transition-colors placeholder:font-sans placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="kyc-full-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {t('fullNameLabel')} <span className="text-rose-500">*</span>
            </label>
            <input
              id="kyc-full-name"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              placeholder="NGUYEN VAN A"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Standard Guidelines Box */}
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-400" />
        <div className="space-y-1 text-xs">
          <span className="block font-bold text-slate-900 dark:text-slate-100">
            {t('notesTitle')}
          </span>
          <ul className="space-y-0.5 font-medium text-slate-600 dark:text-slate-400">
            {activeOption.notes.map((note) => (
              <li key={note} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {kycErrorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{kycErrorMsg}</span>
        </div>
      )}

      {/* Step 3: Photo Upload Dropzones */}
      <div className="space-y-3">
        <span className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800 text-[11px] font-bold text-white">
            3
          </span>
          {t('frontLabel')}
        </span>

        <KycPhotoUploadDropzone
          activeOption={activeOption}
          frontImagePreview={frontImagePreview}
          backImagePreview={backImagePreview}
          existingFront={existingFront}
          existingBack={existingBack}
          isReuploadMode={isReuploadMode}
          frontFileRef={frontFileRef}
          backFileRef={backFileRef}
          setFrontImagePreview={setFrontImagePreview}
          setBackImagePreview={setBackImagePreview}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-200/80 pt-4 dark:border-slate-800">
        {isReuploadMode && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsReuploadMode(false);
            }}
            className="cursor-pointer text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400"
          >
            {tActions('cancel')}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-800 px-8 py-3 text-xs font-bold text-white shadow-md shadow-emerald-950/20 transition-[transform,background-color] hover:bg-emerald-900 active:scale-[0.98]"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isReuploadMode || isRejected ? t('resubmitBtn') : t('submitBtn')}
        </Button>
      </div>
    </form>
  );
}
