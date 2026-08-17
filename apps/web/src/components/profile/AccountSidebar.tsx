'use client';

import {
  User,
  ShoppingBag,
  Sprout,
  MapPin,
  ShieldCheck,
  FileText,
  Gift,
  Settings,
  KeyRound,
  PenTool,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { SidebarItem } from './SidebarItem';
import { UserCard } from './UserCard';

type AccountSidebarProps = {
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  profile?: {
    fullName?: string;
    email?: string;
    rank?: string;
  } | null;
  treesCount?: number;
  contractsCount?: number;
};

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  treesCount,
  contractsCount,
}) => {
  const tSidebar = useTranslations('accountSidebar');
  const tNav = useTranslations('nav');

  const accountNavGroups = [
    {
      title: tNav('my_account'),
      items: [
        {
          id: 'info',
          label: tSidebar('info'),
          icon: <User className="h-4 w-4" />,
        },
        {
          id: 'orders',
          label: tSidebar('orders'),
          icon: <ShoppingBag className="h-4 w-4" />,
        },
        {
          id: 'assets',
          label: tSidebar('trees'),
          icon: <Sprout className="h-4 w-4" />,
          badge: treesCount,
        },
        {
          id: 'address',
          label: tSidebar('addresses'),
          icon: <MapPin className="h-4 w-4" />,
        },
      ],
    },
    {
      title: tNav('security'),
      items: [
        {
          id: 'kyc',
          label: tSidebar('kyc'),
          icon: <ShieldCheck className="h-4 w-4" />,
        },
        {
          id: 'contracts',
          label: tSidebar('contracts'),
          icon: <FileText className="h-4 w-4" />,
          badge: contractsCount,
        },
        {
          id: 'digital-signature',
          label: tSidebar('digitalSignature'),
          icon: <PenTool className="h-4 w-4" />,
        },
        {
          id: 'change-password',
          label: tSidebar('security'),
          icon: <KeyRound className="h-4 w-4" />,
        },
        {
          id: 'settings',
          label: tSidebar('settings'),
          icon: <Settings className="h-4 w-4" />,
        },
      ],
    },
    {
      title: tNav('promotions'),
      items: [
        {
          id: 'referral',
          label: tSidebar('referral'),
          icon: <Gift className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-full flex-shrink-0 lg:w-[280px]">
      {/* User Card */}
      <UserCard fullName={profile?.fullName} email={profile?.email} rank={profile?.rank} />

      {/* Mobile Horizontal Segmented Tab Bar */}
      <div className="w-full scrollbar-none overflow-x-auto pb-2 lg:hidden">
        <div className="flex min-w-max items-center gap-1.5 rounded-2xl border border-gray-100/80 bg-white p-1.5 shadow-xs">
          {accountNavGroups
            .flatMap((group) => group.items)
            .map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-[color,background-color,box-shadow] ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      className={`py-0.2 ml-1 rounded-full px-1.5 text-[10px] leading-tight font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </div>
      </div>

      {/* Desktop Vertical Menu */}
      <div className="hidden space-y-4 rounded-2xl border border-gray-100/80 bg-white p-3 shadow-xs lg:block">
        {accountNavGroups.map((group, groupIdx) => (
          <div key={group.title}>
            {groupIdx > 0 && <div className="my-2 border-t border-gray-100" />}
            <p className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              {group.title}
            </p>
            <div className="mt-1 space-y-0.5">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  active={activeTab === item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                  }}
                  badge={item.badge}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
