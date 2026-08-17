'use client';

import { Gift, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Button } from '@/components/ui/button';

type ProfileReferralTabProps = {
  referralCode: string;
  onCopyText: (text: string, label: string) => void;
};

export const ProfileReferralTab: React.FC<ProfileReferralTabProps> = ({
  referralCode,
  onCopyText,
}) => {
  const t = useTranslations('referralTab');
  const tActions = useTranslations('actions');

  const referralLink =
    typeof window === 'undefined'
      ? `https://samngoclinh.vn/sign-up?ref=${referralCode}`
      : `${window.location.origin}/sign-up?ref=${referralCode}`;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4 dark:border-gray-800">
        <h3 className="flex items-center gap-2 text-xl font-extrabold text-gray-900 dark:text-gray-100">
          <Gift className="h-5 w-5 text-amber-600" />
          <span>{t('title')}</span>
        </h3>
        <p className="mt-0.5 text-xs font-medium text-gray-400">{t('subtitle')}</p>
      </div>

      {/* Hero Banner Card */}
      <div className="space-y-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-950 uppercase">
            {t('totalCommission')}
          </span>
          <span className="text-xs font-medium text-emerald-300">{t('availableBalance')}</span>
        </div>

        <div className="space-y-2">
          <h4 className="font-display-lg text-2xl font-black text-white sm:text-3xl">
            {t('title')}
          </h4>
          <p className="max-w-xl text-xs leading-relaxed text-emerald-200/90 sm:text-sm">
            {t('subtitle')}
          </p>
        </div>

        {/* Code & Link Box */}
        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
          <div className="space-y-2 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
            <span className="block text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
              {t('myCode')}
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xl font-black tracking-widest text-amber-400">
                {referralCode}
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  onCopyText(referralCode, t('myCode'));
                }}
                className="cursor-pointer border-0 bg-white/20 text-xs text-white hover:bg-white/30"
              >
                <Copy className="mr-1 h-3.5 w-3.5" />
                <span>{tActions('copy')}</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
            <span className="block text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
              {t('myLink')}
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-mono text-xs text-white/80">{referralLink}</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  onCopyText(referralLink, t('myLink'));
                }}
                className="shrink-0 cursor-pointer border-0 bg-white/20 text-xs text-white hover:bg-white/30"
              >
                <Copy className="mr-1 h-3.5 w-3.5" />
                <span>{tActions('copy')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2 rounded-2xl border border-gray-200/80 bg-gray-50 p-5 dark:border-gray-800 dark:bg-slate-900">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 font-bold text-amber-800">
            1
          </div>
          <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100">{t('myCode')}</h5>
          <p className="text-xs text-gray-500">{t('subtitle')}</p>
        </div>

        <div className="space-y-2 rounded-2xl border border-gray-200/80 bg-gray-50 p-5 dark:border-gray-800 dark:bg-slate-900">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-800">
            2
          </div>
          <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100">{t('colUser')}</h5>
          <p className="text-xs text-gray-500">{t('noReferrals')}</p>
        </div>

        <div className="space-y-2 rounded-2xl border border-gray-200/80 bg-gray-50 p-5 dark:border-gray-800 dark:bg-slate-900">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-800">
            3
          </div>
          <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {t('totalCommission')}
          </h5>
          <p className="text-xs text-gray-500">{t('withdrawBtn')}</p>
        </div>
      </div>
    </div>
  );
};
