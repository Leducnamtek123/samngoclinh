'use client';

import { Clock, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { KycDocTypeBadge } from './KycDocTypeBadge';

type KycPendingCardProps = {
  actualKycData: Record<string, any> | null | undefined;
  existingFront: string;
  existingBack: string;
  onReupload: () => void;
};

export function KycPendingCard({
  actualKycData,
  existingFront,
  existingBack,
  onReupload,
}: KycPendingCardProps) {
  const t = useTranslations('kyc');

  return (
    <Card className="overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 shadow-xs dark:border-amber-900/80 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <Clock className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t('pendingTitle')}
              </h4>
              <p className="mt-0.5 text-xs font-medium text-amber-800 dark:text-amber-400">
                {t('pendingDesc')}
              </p>
            </div>
          </div>
          <div className="self-start sm:self-auto">
            <KycDocTypeBadge type={actualKycData?.documentType} />
          </div>
        </div>

        {existingFront && (
          <div className="grid grid-cols-1 gap-4 border-t border-amber-200/60 pt-2 sm:grid-cols-2 dark:border-amber-900/40">
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('frontPhoto')}
              </span>
              <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
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
                <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
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

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReupload}
            className="cursor-pointer gap-1.5 border-amber-300 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/60"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t('reuploadOther')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
