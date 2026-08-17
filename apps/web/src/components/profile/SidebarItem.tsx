'use client';

import React from 'react';

type SidebarItemProps = {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  badge?: string | number;
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  active,
  onClick,
  badge,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-[color,background-color,box-shadow] duration-150 sm:text-sm ${
      active
        ? 'bg-emerald-800 font-semibold text-white shadow-xs shadow-emerald-900/10'
        : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'
    }`}
  >
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={`flex-shrink-0 transition-colors ${
          active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
        }`}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </div>

    {badge !== undefined && (
      <span
        className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
          active ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {badge}
      </span>
    )}
  </button>
);
