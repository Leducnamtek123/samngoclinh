'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Camera,
  AlertOctagon,
  History,
  RotateCcw,
  ShieldCheck,
  Calendar,
  FileCheck,
  CreditCard,
  Car,
  Globe,
  UploadCloud,
  Info,
  Check,
} from 'lucide-react';
import { ButtonLoading, Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { formatLocalDateTime } from '@/utils/datetime';
import type { UserProfile, IdentityVerificationStatus } from '@/types';
import {
  useIdentityVerificationHistory,
  type IdentityDocumentType,
} from '@/hooks/queries/useIdentityVerification';

type ProfileKycTabProps = {
  profile?: UserProfile | null;
  kycStatusData?: IdentityVerificationStatus | null;
  refetchKycStatus?: () => void;
  submitKycMutation: any;
};

interface DocumentOption {
  id: IdentityDocumentType;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  fieldLabel: string;
  fieldPlaceholder: string;
  frontTitle: string;
  frontDescription: string;
  backTitle: string;
  backDescription: string;
  isBackRequired: boolean;
  notes: string[];
}

// Subcomponent: Document Type Badge
function KycDocTypeBadge({ type }: { type?: string }) {
  const t = useTranslations('kyc');

  switch (type) {
    case 'passport':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
          {t('docTypes.passport')}
        </span>
      );
    case 'driver_license':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <Car className="w-3.5 h-3.5 text-sky-600" />
          {t('docTypes.driverLicense')}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
          {t('docTypes.cccd')}
        </span>
      );
  }
}

// Subcomponent: Verified State Certificate Card
function KycVerifiedCard({
  actualKycData,
  profile,
  existingFront,
  existingBack,
}: {
  actualKycData: any;
  profile?: UserProfile | null;
  existingFront: string;
  existingBack: string;
}) {
  const t = useTranslations('kyc');

  return (
    <Card className="border border-emerald-200/90 dark:border-emerald-900 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 rounded-2xl shadow-xs overflow-hidden">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {t('verifiedCertificate')}
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-400 font-medium mt-0.5">
                {t('verifiedCertificateDesc')}
              </p>
            </div>
          </div>
          <div className="self-start sm:self-auto">
            <KycDocTypeBadge type={actualKycData?.documentType} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/90 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-medium block">{t('documentNumber')}</span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
              {actualKycData?.idCardNumber || actualKycData?.idNumber || t('verifiedMatch')}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-medium block">{t('ownerName')}</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {actualKycData?.fullName || profile?.name || t('accountOwner')}
            </span>
          </div>
        </div>

        {existingFront && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/60">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                {t('frontPhoto')}
              </span>
              <div className="relative h-36 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center">
                <Image
                  src={existingFront}
                  alt={t('frontAlt')}
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  unoptimized
                  className="object-contain p-1"
                />
              </div>
            </div>

            {existingBack && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  {t('backPhoto')}
                </span>
                <div className="relative h-36 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center">
                  <Image
                    src={existingBack}
                    alt={t('backAlt')}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    unoptimized
                    className="object-contain p-1"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Subcomponent: Pending Review State Card
function KycPendingCard({
  actualKycData,
  existingFront,
  existingBack,
  onReupload,
}: {
  actualKycData: any;
  existingFront: string;
  existingBack: string;
  onReupload: () => void;
}) {
  const t = useTranslations('kyc');

  return (
    <Card className="border border-amber-200/90 dark:border-amber-900/80 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 rounded-2xl shadow-xs overflow-hidden">
      <CardContent className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {t('pendingTitle')}
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-400 font-medium mt-0.5">
                {t('pendingDesc')}
              </p>
            </div>
          </div>
          <div className="self-start sm:self-auto">
            <KycDocTypeBadge type={actualKycData?.documentType} />
          </div>
        </div>

        {existingFront && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                {t('frontPhoto')}
              </span>
              <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center">
                <Image src={existingFront} alt={t('frontAlt')} fill sizes="(max-width: 640px) 100vw, 320px" unoptimized className="object-contain p-1" />
              </div>
            </div>
            {existingBack && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  {t('backPhoto')}
                </span>
                <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center">
                  <Image src={existingBack} alt={t('backAlt')} fill sizes="(max-width: 640px) 100vw, 320px" unoptimized className="object-contain p-1" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReupload}
            className="text-xs font-semibold text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-950/60 gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t('reuploadOther')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Subcomponent: Photo Upload Dropzones
function KycPhotoUploadDropzone({
  activeOption,
  frontImagePreview,
  backImagePreview,
  existingFront,
  existingBack,
  isReuploadMode,
  frontFileRef,
  backFileRef,
  setFrontImagePreview,
  setBackImagePreview,
}: {
  activeOption: DocumentOption;
  frontImagePreview: string;
  backImagePreview: string;
  existingFront: string;
  existingBack: string;
  isReuploadMode: boolean;
  frontFileRef: React.MutableRefObject<File | null>;
  backFileRef: React.MutableRefObject<File | null>;
  setFrontImagePreview: (val: string) => void;
  setBackImagePreview: (val: string) => void;
}) {
  const t = useTranslations('kyc');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Front Photo Zone */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {activeOption.frontTitle} <span className="text-rose-500">*</span>
          </span>
          <span className="text-[11px] text-slate-400">{t('formatHint')}</span>
        </div>

        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-[border-color,box-shadow] bg-white dark:bg-slate-900 min-h-[190px] relative group overflow-hidden shadow-2xs hover:shadow-xs">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                frontFileRef.current = file;
                const reader = new FileReader();
                reader.onload = (ev) => setFrontImagePreview(ev.target?.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
          {frontImagePreview ? (
            <div className="relative h-40 w-full flex items-center justify-center">
              <Image src={frontImagePreview} alt={t('frontAlt')} fill sizes="(max-width: 768px) 100vw, 400px" unoptimized className="object-contain rounded-xl" />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1.5">
                <Camera className="w-4 h-4" />
                {t('reuploadOther')}
              </div>
              <span className="absolute bottom-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                {t('uploadSuccess')}
              </span>
            </div>
          ) : existingFront && !isReuploadMode ? (
            <div className="relative h-40 w-full flex items-center justify-center">
              <Image src={existingFront} alt={t('frontAlt')} fill sizes="(max-width: 768px) 100vw, 400px" unoptimized className="object-contain rounded-xl" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 text-center p-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {activeOption.frontTitle}
                </span>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  {activeOption.frontDescription}
                </span>
              </div>
            </div>
          )}
        </label>
      </div>

      {/* Back Photo Zone */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {activeOption.backTitle}{' '}
            {activeOption.isBackRequired ? <span className="text-rose-500">*</span> : <span className="text-slate-400 font-normal">({t('optional')})</span>}
          </span>
          <span className="text-[11px] text-slate-400">{t('formatHint')}</span>
        </div>

        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-[border-color,box-shadow] bg-white dark:bg-slate-900 min-h-[190px] relative group overflow-hidden shadow-2xs hover:shadow-xs">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                backFileRef.current = file;
                const reader = new FileReader();
                reader.onload = (ev) => setBackImagePreview(ev.target?.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
          {backImagePreview ? (
            <div className="relative h-40 w-full flex items-center justify-center">
              <Image src={backImagePreview} alt={t('backAlt')} fill sizes="(max-width: 768px) 100vw, 400px" unoptimized className="object-contain rounded-xl" />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1.5">
                <Camera className="w-4 h-4" />
                {t('reuploadOther')}
              </div>
              <span className="absolute bottom-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                {t('uploadSuccess')}
              </span>
            </div>
          ) : existingBack && !isReuploadMode ? (
            <div className="relative h-40 w-full flex items-center justify-center">
              <Image src={existingBack} alt={t('backAlt')} fill sizes="(max-width: 768px) 100vw, 400px" unoptimized className="object-contain rounded-xl" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 text-center p-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {activeOption.backTitle}
                </span>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  {activeOption.backDescription}
                </span>
              </div>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}

// Subcomponent: Verification History Table
function KycHistoryList({ historyList, formatDate }: { historyList: any[]; formatDate: (d?: string) => string }) {
  const t = useTranslations('kyc');
  if (historyList.length === 0) return null;

  return (
    <div className="space-y-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
        <History className="w-4 h-4 text-emerald-600" />
        <span>{t('historyTitle')} ({historyList.length})</span>
      </div>

      <div className="space-y-3">
        {historyList.map((item: any, idx: number) => {
          const isItemApproved = item.status === 'APPROVED';
          const isItemRejected = item.status === 'REJECTED';
          return (
            <div
              key={item.id || `${item.documentType}-${item.createdAt || 'kyc'}`}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {t('attempt', { index: historyList.length - idx })}
                  </span>
                  <KycDocTypeBadge type={item.documentType} />
                  <span
                    className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                      isItemApproved
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isItemRejected
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {isItemApproved ? t('verified') : isItemRejected ? t('rejected') : t('pending')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(item.createdAt)}</span>
                  {item.idCardNumber && (
                    <span>
                      {t('documentNumber')}: <strong className="font-mono text-slate-700 dark:text-slate-300">{item.idCardNumber}</strong>
                    </span>
                  )}
                </div>

                {isItemRejected && item.rejectionReason && (
                  <p className="text-rose-600 font-medium pt-1">
                    {t('rejectionReason')} {item.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Subcomponent: Submission Form
function KycSubmissionForm({
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
}: {
  isRejected: boolean;
  isReuploadMode: boolean;
  actualKycData: any;
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
}) {
  const t = useTranslations('kyc');
  const tActions = useTranslations('actions');

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isRejected && !isReuploadMode && (
        <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/30 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs flex-1">
            <h4 className="font-bold text-sm text-rose-900 dark:text-rose-200">
              {t('rejectedTitle')}
            </h4>
            <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 font-medium">
              <span className="font-bold block text-rose-900 dark:text-rose-200 mb-0.5">{t('rejectionReason')}</span>
              {actualKycData?.rejectionReason || t('guide2')}
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium pt-1">
              {t('guide1')}
            </p>
          </div>
        </div>
      )}

      {/* Step 1: Select Document Type */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] font-bold inline-flex items-center justify-center">
              1
            </span>
            {t('selectDocType')}
          </span>
          <span className="text-xs text-slate-400 font-medium">*</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documentOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = documentType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setDocumentType(opt.id);
                  setKycErrorMsg('');
                }}
                className={`relative p-5 rounded-2xl border text-left transition-[border-color,background-color,box-shadow] cursor-pointer flex flex-col justify-between min-h-[120px] ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-600/20 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                    {opt.title}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
                    {opt.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Document Details Input */}
      <div className="space-y-4 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] font-bold inline-flex items-center justify-center">
            2
          </span>
          {t('enterDocInfo')}
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="kyc-id-card-number" className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              {activeOption.fieldLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              id="kyc-id-card-number"
              type="text"
              value={idCardNumber}
              onChange={(e) => setIdCardNumber(e.target.value)}
              placeholder={activeOption.fieldPlaceholder}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold font-mono text-slate-900 dark:text-slate-100 placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="kyc-full-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              {t('fullNameLabel')} <span className="text-rose-500">*</span>
            </label>
            <input
              id="kyc-full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="NGUYEN VAN A"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Standard Guidelines Box */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-slate-900 dark:text-slate-100 block">
            {t('notesTitle')}
          </span>
          <ul className="space-y-0.5 text-slate-600 dark:text-slate-400 font-medium">
            {activeOption.notes.map((note) => (
              <li key={note} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {kycErrorMsg && (
        <div className="p-4 rounded-xl border border-rose-200 dark:rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{kycErrorMsg}</span>
        </div>
      )}

      {/* Step 3: Photo Upload Dropzones */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] font-bold inline-flex items-center justify-center">
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
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        {isReuploadMode && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsReuploadMode(false)}
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
          >
            {tActions('cancel')}
          </Button>
        )}
        <ButtonLoading
          type="submit"
          isLoading={isSubmitting}
          className="bg-emerald-800 hover:bg-emerald-900 text-white px-8 py-3 rounded-xl font-bold text-xs shadow-md shadow-emerald-950/20 active:scale-[0.98] transition-[transform,background-color] cursor-pointer"
        >
          {isReuploadMode || isRejected ? t('resubmitBtn') : t('submitBtn')}
        </ButtonLoading>
      </div>
    </form>
  );
}

export const ProfileKycTab = ({
  profile,
  kycStatusData,
  refetchKycStatus,
  submitKycMutation,
}: ProfileKycTabProps) => {
  const t = useTranslations('kyc');
  const actualKycData = (kycStatusData as any)?.data || kycStatusData;

  const DOCUMENT_OPTIONS: DocumentOption[] = [
    {
      id: 'cccd',
      title: t('docTypes.cccd'),
      subtitle: t('docTypes.cccdSubtitle'),
      icon: CreditCard,
      fieldLabel: t('docTypes.cccdFieldLabel'),
      fieldPlaceholder: t('docTypes.cccdPlaceholder'),
      frontTitle: t('docTypes.cccdFrontTitle'),
      frontDescription: t('docTypes.cccdFrontDesc'),
      backTitle: t('docTypes.cccdBackTitle'),
      backDescription: t('docTypes.cccdBackDesc'),
      isBackRequired: true,
      notes: [
        t('guide1'),
        t('guide2'),
      ],
    },
    {
      id: 'driver_license',
      title: t('docTypes.driverLicense'),
      subtitle: t('docTypes.driverLicenseSubtitle'),
      icon: Car,
      fieldLabel: t('docTypes.driverLicenseFieldLabel'),
      fieldPlaceholder: t('docTypes.driverLicensePlaceholder'),
      frontTitle: t('docTypes.driverLicenseFrontTitle'),
      frontDescription: t('docTypes.driverLicenseFrontDesc'),
      backTitle: t('docTypes.driverLicenseBackTitle'),
      backDescription: t('docTypes.driverLicenseBackDesc'),
      isBackRequired: true,
      notes: [
        t('guide1'),
        t('guide3'),
      ],
    },
    {
      id: 'passport',
      title: t('docTypes.passport'),
      subtitle: t('docTypes.passportSubtitle'),
      icon: Globe,
      fieldLabel: t('docTypes.passportFieldLabel'),
      fieldPlaceholder: t('docTypes.passportPlaceholder'),
      frontTitle: t('docTypes.passportFrontTitle'),
      frontDescription: t('docTypes.passportFrontDesc'),
      backTitle: t('docTypes.passportBackTitle'),
      backDescription: t('docTypes.passportBackDesc'),
      isBackRequired: false,
      notes: [
        t('guide1'),
        t('guide2'),
      ],
    },
  ];

  const [userDocumentType, setUserDocumentType] = useState<IdentityDocumentType | null>(null);
  const [userIdCardNumber, setUserIdCardNumber] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);

  const documentType: IdentityDocumentType = userDocumentType ?? (actualKycData?.documentType as IdentityDocumentType) ?? 'cccd';
  const setDocumentType = (val: IdentityDocumentType) => setUserDocumentType(val);

  const idCardNumber = userIdCardNumber ?? actualKycData?.idCardNumber ?? actualKycData?.idNumber ?? '';
  const setIdCardNumber = (val: string) => setUserIdCardNumber(val);

  const fullName = userFullName ?? actualKycData?.fullName ?? profile?.name ?? '';
  const setFullName = (val: string) => setUserFullName(val);

  const [frontImagePreview, setFrontImagePreview] = useState('');
  const [backImagePreview, setBackImagePreview] = useState('');
  const frontFileRef = useRef<File | null>(null);
  const backFileRef = useRef<File | null>(null);
  const [kycErrorMsg, setKycErrorMsg] = useState('');
  const [isReuploadMode, setIsReuploadMode] = useState(false);

  const { data: historyList = [] } = useIdentityVerificationHistory();

  const activeOption: DocumentOption = DOCUMENT_OPTIONS.find((o) => o.id === documentType) || DOCUMENT_OPTIONS[0]!;

  const statusStr = (actualKycData?.status || '').toUpperCase();
  const isVerified = statusStr === 'APPROVED' || statusStr === 'VERIFIED';
  const isPending = statusStr === 'PENDING' || statusStr === 'PROCESSING';
  const isRejected = statusStr === 'REJECTED';

  const existingFront = actualKycData?.frontImageUrl || actualKycData?.frontUrl || '';
  const existingBack = actualKycData?.backImageUrl || actualKycData?.backUrl || '';

  const formatDate = (dateStr?: string) => {
    return formatLocalDateTime(dateStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitKycMutation.isPending) return;
    setKycErrorMsg('');

    const cleanId = idCardNumber.trim();
    if (!cleanId) {
      setKycErrorMsg(t('idNumberLabel'));
      return;
    }

    if (documentType === 'cccd' && cleanId.length !== 12) {
      setKycErrorMsg(t('docTypes.cccdFieldLabel'));
      return;
    }

    if (!fullName.trim()) {
      setKycErrorMsg(t('fullNameLabel'));
      return;
    }

    const hasFront = !!frontFileRef.current || (existingFront && !isReuploadMode);
    if (!hasFront) {
      setKycErrorMsg(t('uploadFront'));
      return;
    }

    const hasBack = !!backFileRef.current || (existingBack && !isReuploadMode);
    if (activeOption.isBackRequired && !hasBack) {
      setKycErrorMsg(t('uploadBack'));
      return;
    }

    try {
      const payload: any = {
        documentType,
        idCardNumber: cleanId,
        fullName: fullName.trim(),
        frontBase64: frontImagePreview || undefined,
        backBase64: backImagePreview || undefined,
      };

      if (frontImagePreview?.startsWith('data:') && (!activeOption.isBackRequired || backImagePreview?.startsWith('data:'))) {
        await submitKycMutation.mutateAsync(payload);
      } else if (frontFileRef.current || backFileRef.current) {
        const formData = new FormData();
        formData.append('documentType', documentType);
        formData.append('idCardNumber', cleanId);
        formData.append('fullName', fullName.trim());

        if (frontFileRef.current) {
          formData.append('front', frontFileRef.current);
          formData.append('frontImage', frontFileRef.current);
        } else if (frontImagePreview) {
          formData.append('frontBase64', frontImagePreview);
        }

        if (backFileRef.current) {
          formData.append('back', backFileRef.current);
          formData.append('backImage', backFileRef.current);
        } else if (backImagePreview) {
          formData.append('backBase64', backImagePreview);
        }

        await submitKycMutation.mutateAsync(formData);
      } else {
        await submitKycMutation.mutateAsync(payload);
      }

      toast.success(t('submitSuccess'));
      setIsReuploadMode(false);
      if (refetchKycStatus) refetchKycStatus();
    } catch (err: any) {
      const errorMsg = err?.message || t('submitError');
      setKycErrorMsg(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section with refined luxury framing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {t('title')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium max-w-2xl leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex-shrink-0">
          {isVerified ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t('verified')}
            </span>
          ) : isRejected ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
              <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              {t('rejected')}
            </span>
          ) : isPending ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-pulse">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              {t('pending')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              {t('unverified')}
            </span>
          )}
        </div>
      </div>

      {/* STATE 1: VERIFIED CERTIFICATE CARD */}
      {isVerified && (
        <KycVerifiedCard
          actualKycData={actualKycData}
          profile={profile}
          existingFront={existingFront}
          existingBack={existingBack}
        />
      )}

      {/* STATE 2: PENDING REVIEW NOTICE */}
      {isPending && !isReuploadMode && (
        <KycPendingCard
          actualKycData={actualKycData}
          existingFront={existingFront}
          existingBack={existingBack}
          onReupload={() => setIsReuploadMode(true)}
        />
      )}

      {/* STATE 3: ONBOARDING / SUBMISSION FORM */}
      {((!isVerified && !isPending) || isReuploadMode) && (
        <KycSubmissionForm
          isRejected={isRejected}
          isReuploadMode={isReuploadMode}
          actualKycData={actualKycData}
          documentType={documentType}
          setDocumentType={setDocumentType}
          setKycErrorMsg={setKycErrorMsg}
          idCardNumber={idCardNumber}
          setIdCardNumber={setIdCardNumber}
          fullName={fullName}
          setFullName={setFullName}
          activeOption={activeOption}
          kycErrorMsg={kycErrorMsg}
          frontImagePreview={frontImagePreview}
          backImagePreview={backImagePreview}
          existingFront={existingFront}
          existingBack={existingBack}
          frontFileRef={frontFileRef}
          backFileRef={backFileRef}
          setFrontImagePreview={setFrontImagePreview}
          setBackImagePreview={setBackImagePreview}
          setIsReuploadMode={setIsReuploadMode}
          handleSubmit={handleSubmit}
          isSubmitting={submitKycMutation.isPending}
          documentOptions={DOCUMENT_OPTIONS}
        />
      )}

      {/* History Log Section */}
      <KycHistoryList historyList={historyList} formatDate={formatDate} />
    </div>
  );
};
