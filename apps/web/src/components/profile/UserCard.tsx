'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
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
    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 relative overflow-hidden mb-5">
      <div className="flex items-center gap-3.5 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-950/20 flex-shrink-0">
          {initial}
        </div>
        <div className="overflow-hidden min-w-0 flex-1">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate leading-tight">
            {displayName}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
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
