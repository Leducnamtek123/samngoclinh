'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Gift, Copy } from 'lucide-react';
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

  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/sign-up?ref=${referralCode}`
    : `https://samngoclinh.vn/sign-up?ref=${referralCode}`;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-600" />
          <span>{t('title')}</span>
        </h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          {t('subtitle')}
        </p>
      </div>

      {/* Hero Banner Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white shadow-xl border border-emerald-500/30 space-y-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
            {t('totalCommission')}
          </span>
          <span className="text-xs text-emerald-300 font-medium">{t('availableBalance')}</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-2xl sm:text-3xl font-black text-white font-display-lg">
            {t('title')}
          </h4>
          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed max-w-xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Code & Link Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">{t('myCode')}</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xl font-black text-amber-400 font-mono tracking-widest">{referralCode}</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onCopyText(referralCode, t('myCode'))}
                className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                <span>{tActions('copy')}</span>
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">{t('myLink')}</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-white/80 truncate font-mono">{referralLink}</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onCopyText(referralLink, t('myLink'))}
                className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs shrink-0 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                <span>{tActions('copy')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200/80 dark:border-gray-800 space-y-2">
          <div className="size-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            1
          </div>
          <h5 className="font-bold text-sm text-gray-900 dark:text-gray-100">{t('myCode')}</h5>
          <p className="text-xs text-gray-500">{t('subtitle')}</p>
        </div>

        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200/80 dark:border-gray-800 space-y-2">
          <div className="size-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            2
          </div>
          <h5 className="font-bold text-sm text-gray-900 dark:text-gray-100">{t('colUser')}</h5>
          <p className="text-xs text-gray-500">{t('noReferrals')}</p>
        </div>

        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200/80 dark:border-gray-800 space-y-2">
          <div className="size-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            3
          </div>
          <h5 className="font-bold text-sm text-gray-900 dark:text-gray-100">{t('totalCommission')}</h5>
          <p className="text-xs text-gray-500">{t('withdrawBtn')}</p>
        </div>
      </div>
    </div>
  );
};
