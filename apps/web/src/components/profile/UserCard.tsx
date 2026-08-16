'use client';

import React from 'react';

type UserCardProps = {
  fullName?: string;
  email?: string;
  rank?: string;
  walletBalance?: number;
};

export const UserCard: React.FC<UserCardProps> = ({
  fullName = 'Khách hàng',
  email = '',
  rank = 'Khách hàng',
}) => {
  const initial = fullName.charAt(0).toUpperCase() || 'U';

  return (
    <div className="p-4 bg-gradient-to-br from-emerald-900/90 to-emerald-950 text-white rounded-2xl shadow-sm border border-emerald-800/40 relative overflow-hidden mb-5">
      {/* Subtle Background Pattern */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

      <div className="flex items-center gap-3.5 relative z-10">
        <div className="w-11 h-11 rounded-full bg-emerald-700/80 border border-emerald-400/30 text-white flex items-center justify-center font-bold text-base shadow-inner flex-shrink-0">
          {initial}
        </div>
        <div className="overflow-hidden min-w-0 flex-1">
          <h3 className="font-bold text-sm text-white truncate leading-tight">
            {fullName}
          </h3>
          <p className="text-xs text-emerald-200/80 font-medium truncate mt-0.5">
            {email}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 uppercase tracking-wider">
              {rank}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
