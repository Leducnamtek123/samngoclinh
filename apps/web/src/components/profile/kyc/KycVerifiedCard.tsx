'use client';

import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { UserProfile } from '@/types';
import { KycDocTypeBadge } from './KycDocTypeBadge';

type KycVerifiedCardProps = {
  actualKycData: Record<string, any> | null | undefined;
  profile?: UserProfile | null;
  existingFront: string;
  existingBack: string;
};

export function KycVerifiedCard({
  actualKycData,
  profile,
  existingFront,
  existingBack,
}: KycVerifiedCardProps) {
  const t = useTranslations('kyc');

  return (
    <Card className="overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/30 shadow-xs dark:border-emerald-900 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30">
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t('verifiedCertificate')}
              </h4>
              <p className="mt-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-400">
                {t('verifiedCertificateDesc')}
              </p>
            </div>
          </div>
          <div className="self-start sm:self-auto">
            <KycDocTypeBadge type={actualKycData?.documentType} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200/80 bg-white/90 p-4 text-xs md:grid-cols-2 dark:border-slate-700/80 dark:bg-slate-800/80">
          <div className="space-y-1">
            <span className="block font-medium text-slate-400">{t('documentNumber')}</span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
              {actualKycData?.idCardNumber || actualKycData?.idNumber || t('verifiedMatch')}
            </span>
          </div>
          <div className="space-y-1">
            <span className="block font-medium text-slate-400">{t('ownerName')}</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {actualKycData?.fullName || profile?.name || t('accountOwner')}
            </span>
          </div>
        </div>

        {existingFront && (
          <div className="grid grid-cols-1 gap-4 border-t border-emerald-200/60 pt-2 sm:grid-cols-2 dark:border-emerald-900/60">
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('frontPhoto')}
              </span>
              <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
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
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t('backPhoto')}
                </span>
                <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
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
