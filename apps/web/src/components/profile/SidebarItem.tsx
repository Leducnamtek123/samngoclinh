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
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
        active
          ? 'bg-emerald-800 text-white font-semibold shadow-xs shadow-emerald-900/10'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`transition-colors flex-shrink-0 ${
            active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
          }`}
        >
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>

      {badge !== undefined && (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
            active
              ? 'bg-emerald-700 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};
