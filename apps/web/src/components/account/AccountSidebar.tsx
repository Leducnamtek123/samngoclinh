'use client';

import React from 'react';
import {
  User,
  ShoppingBag,
  Sprout,
  MapPin,
  Lock,
  ShieldCheck,
  FileText,
  Gift,
  Settings,
  KeyRound,
} from 'lucide-react';
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
  ordersCount?: number;
  treesCount?: number;
  contractsCount?: number;
};

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  ordersCount,
  treesCount,
  contractsCount,
}) => {
  const accountNavGroups = [
    {
      title: 'Tài khoản & Giao dịch',
      items: [
        {
          id: 'info',
          label: 'Hồ sơ cá nhân',
          icon: <User className="w-4 h-4" />,
        },
        {
          id: 'orders',
          label: 'Lịch sử đơn hàng',
          icon: <ShoppingBag className="w-4 h-4" />,
          badge: ordersCount,
        },
        {
          id: 'assets',
          label: 'Tài sản cây sâm',
          icon: <Sprout className="w-4 h-4" />,
          badge: treesCount,
        },
        {
          id: 'address',
          label: 'Sổ địa chỉ',
          icon: <MapPin className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Bảo mật & Cấu hình',
      items: [
        {
          id: 'pin',
          label: 'Mã PIN giao dịch',
          icon: <Lock className="w-4 h-4" />,
        },
        {
          id: 'kyc',
          label: 'Xác minh KYC',
          icon: <ShieldCheck className="w-4 h-4" />,
        },
        {
          id: 'contracts',
          label: 'Hợp đồng điện tử',
          icon: <FileText className="w-4 h-4" />,
          badge: contractsCount,
        },
        {
          id: 'change-password',
          label: 'Đổi mật khẩu',
          icon: <KeyRound className="w-4 h-4" />,
        },
        {
          id: 'settings',
          label: 'Cài đặt hệ thống',
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Khuyến mãi & Bạn bè',
      items: [
        {
          id: 'referral',
          label: 'Mã giới thiệu',
          icon: <Gift className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-full lg:w-[280px] flex-shrink-0">
      {/* User Card */}
      <UserCard
        fullName={profile?.fullName}
        email={profile?.email}
        rank={profile?.rank}
      />

      {/* Desktop Vertical Menu */}
      <div className="bg-white rounded-2xl p-3 border border-gray-100/80 shadow-xs space-y-4">
        {accountNavGroups.map((group, groupIdx) => (
          <div key={group.title}>
            {groupIdx > 0 && <div className="border-t border-gray-100 my-2" />}
            <p className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {group.title}
            </p>
            <div className="space-y-0.5 mt-1">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  active={activeTab === item.id}
                  onClick={() => onSelectTab(item.id)}
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
