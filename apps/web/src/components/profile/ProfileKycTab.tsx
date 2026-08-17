'use client';

import { AlertOctagon, Clock, FileCheck, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useIdentityVerificationHistory } from '@/hooks/queries/useIdentityVerification';
import type { UserProfile } from '@/types';
import { KycHistoryList } from './kyc/KycHistoryList';
import { KycPendingCard } from './kyc/KycPendingCard';
import { KycSubmissionForm } from './kyc/KycSubmissionForm';
import { KycVerifiedCard } from './kyc/KycVerifiedCard';
import type { DocumentOption, IdentityDocumentType, KycSubmissionData } from './kyc/types';

type ProfileKycTabProps = {
  profile?: UserProfile | null;
  kycStatusData?: KycSubmissionData | { data?: KycSubmissionData } | null;
  refetchKycStatus?: () => void;
  submitKycMutation: {
    mutateAsync: (data: FormData | Record<string, unknown>) => Promise<unknown>;
    isPending: boolean;
  };
};

export const ProfileKycTab = ({
  profile,
  kycStatusData,
  refetchKycStatus,
  submitKycMutation,
}: ProfileKycTabProps) => {
  const t = useTranslations('kyc');
  const actualKycData =
    (kycStatusData as { data?: KycSubmissionData })?.data ||
    (kycStatusData as KycSubmissionData) ||
    null;

  const DOCUMENT_OPTIONS: DocumentOption[] = [
    {
      value: 'cccd',
      label: t('docTypes.cccd'),
      frontTitle: t('docTypes.cccdFrontTitle'),
      frontDescription: t('docTypes.cccdFrontDesc'),
      backTitle: t('docTypes.cccdBackTitle'),
      backDescription: t('docTypes.cccdBackDesc'),
      isBackRequired: true,
      notes: [t('guide1'), t('guide2'), t('guide3')],
    },
    {
      value: 'driver_license',
      label: t('docTypes.driverLicense'),
      frontTitle: t('docTypes.driverLicenseFrontTitle'),
      frontDescription: t('docTypes.driverLicenseFrontDesc'),
      backTitle: t('docTypes.driverLicenseBackTitle'),
      backDescription: t('docTypes.driverLicenseBackDesc'),
      isBackRequired: true,
      notes: [t('guide1'), t('guide3')],
    },
    {
      value: 'passport',
      label: t('docTypes.passport'),
      frontTitle: t('docTypes.passportFrontTitle'),
      frontDescription: t('docTypes.passportFrontDesc'),
      backTitle: t('docTypes.passportBackTitle'),
      backDescription: t('docTypes.passportBackDesc'),
      isBackRequired: false,
      notes: [t('guide1'), t('guide2')],
    },
  ];

  const [userDocumentType, setUserDocumentType] = useState<IdentityDocumentType | null>(null);
  const [userIdCardNumber, setUserIdCardNumber] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);

  const documentType: IdentityDocumentType =
    userDocumentType ?? (actualKycData?.documentType as IdentityDocumentType) ?? 'cccd';
  const setDocumentType = (val: IdentityDocumentType) => {
    setUserDocumentType(val);
  };

  const kyc = (actualKycData || {}) as Record<string, string | undefined>;

  const idCardNumber = String(userIdCardNumber ?? kyc.idCardNumber ?? kyc.idNumber ?? '');
  const setIdCardNumber = (val: string) => {
    setUserIdCardNumber(val);
  };

  const fullName = String(userFullName ?? kyc.fullName ?? profile?.name ?? profile?.fullName ?? '');
  const setFullName = (val: string) => {
    setUserFullName(val);
  };

  const [frontImagePreview, setFrontImagePreview] = useState('');
  const [backImagePreview, setBackImagePreview] = useState('');
  const frontFileRef = useRef<File | null>(null);
  const backFileRef = useRef<File | null>(null);
  const [kycErrorMsg, setKycErrorMsg] = useState('');
  const [isReuploadMode, setIsReuploadMode] = useState(false);

  const { data: historyList = [] } = useIdentityVerificationHistory();

  const activeOption: DocumentOption =
    DOCUMENT_OPTIONS.find((o) => o.value === documentType) || DOCUMENT_OPTIONS[0]!;

  const statusStr = (actualKycData?.status || '').toUpperCase();
  const isVerified = statusStr === 'APPROVED' || statusStr === 'VERIFIED';
  const isPending = statusStr === 'PENDING' || statusStr === 'PROCESSING';
  const isRejected = statusStr === 'REJECTED';

  const existingFront = String(kyc.frontImageUrl || kyc.frontUrl || '');
  const existingBack = String(kyc.backImageUrl || kyc.backUrl || '');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) {
      return '';
    }
    try {
      return new Date(dateStr).toLocaleString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitKycMutation.isPending) {
      return;
    }
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
      const payload: Record<string, unknown> = {
        documentType,
        idCardNumber: cleanId,
        fullName: fullName.trim(),
        frontBase64: frontImagePreview || undefined,
        backBase64: backImagePreview || undefined,
      };

      if (
        frontImagePreview?.startsWith('data:') &&
        (!activeOption.isBackRequired || backImagePreview?.startsWith('data:'))
      ) {
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
      if (refetchKycStatus) {
        refetchKycStatus();
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : t('submitError');
      setKycErrorMsg(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <FileCheck className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {t('title')}
            </h3>
          </div>
          <p className="mt-1.5 max-w-2xl text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex-shrink-0">
          {isVerified ? (
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 shadow-xs dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              {t('verified')}
            </span>
          ) : isRejected ? (
            <span className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-800 dark:border-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              <AlertOctagon className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              {t('rejected')}
            </span>
          ) : isPending ? (
            <span className="inline-flex animate-pulse items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              {t('pending')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
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
          onReupload={() => {
            setIsReuploadMode(true);
          }}
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
