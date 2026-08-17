'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { MemberRankBadge } from './MemberRankBadge';

type UserCardProps = {
  fullName?: string;
  email?: string;
  rank?: string;
  walletBalance?: number;
};

export const UserCard: React.FC<UserCardProps> = ({
  fullName = '',
  email = '',
  rank = 'bronze',
}) => {
  const t = useTranslations('profile');
  const displayName = fullName.trim() || email.split('@')[0] || t('fullName');
  const initial = displayName.charAt(0).toUpperCase() || 'U';

  return (
    <div className="relative mb-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="relative z-10 flex items-center gap-3.5">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-800 text-lg font-black text-white shadow-md shadow-emerald-950/20">
          {initial}
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <h3 className="truncate text-sm leading-tight font-bold text-slate-900 dark:text-slate-100">
            {displayName}
          </h3>
          <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
            {email}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <MemberRankBadge rank={rank} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
