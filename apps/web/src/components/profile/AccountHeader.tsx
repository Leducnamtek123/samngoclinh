'use client';

import React from 'react';

type AccountHeaderProps = {
  activeTab: string;
};

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  info: {
    title: 'Hồ sơ cá nhân',
    subtitle: 'Quản lý thông tin tài khoản, ví điểm thưởng và thông tin liên hệ',
  },
  orders: {
    title: 'Lịch sử đơn hàng',
    subtitle: 'Theo dõi tiến độ đơn hàng và danh sách các gói cây sâm đã đăng ký',
  },
  assets: {
    title: 'Tài sản cây sâm',
    subtitle: 'Quản lý danh sách các cây sâm đang trong quy trình chăm sóc',
  },
  address: {
    title: 'Sổ địa chỉ nhận hàng',
    subtitle: 'Danh sách các địa chỉ giao nhận của bạn khi thanh toán đơn hàng',
  },
  pin: {
    title: 'Mã PIN bảo mật',
    subtitle: 'Cài đặt mã PIN an toàn để bảo vệ giao dịch rút tiền và rút tài sản',
  },
  kyc: {
    title: 'Xác minh danh tính (KYC)',
    subtitle: 'Cung cấp giấy tờ tùy thân để xác thực tài khoản chính chủ',
  },
  contracts: {
    title: 'Hợp đồng điện tử',
    subtitle: 'Quản lý và thực hiện ký số cho các hợp đồng hợp tác đầu tư sâm',
  },
  referral: {
    title: 'Mã giới thiệu',
    subtitle: 'Chia sẻ mã giới thiệu với bạn bè để nhận điểm thưởng ưu đãi',
  },
  settings: {
    title: 'Cài đặt hệ thống',
    subtitle: 'Quản lý cấu hình thông báo, bảo mật 2FA, phiên làm việc và giao diện',
  },
  'change-password': {
    title: 'Đổi mật khẩu',
    subtitle: 'Cập nhật mật khẩu để bảo vệ an toàn cho tài khoản',
  },
};

export const AccountHeader: React.FC<AccountHeaderProps> = ({ activeTab }) => {
  const currentInfo = TAB_TITLES[activeTab] || {
    title: 'Tài khoản',
    subtitle: 'Quản lý thông tin và cài đặt tài khoản của bạn',
  };

  return (
    <div className="mb-6 px-1 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
        <span>Tài khoản</span>
        <span className="text-gray-300 dark:text-gray-700">/</span>
        <span className="text-gray-600 dark:text-gray-400 capitalize">{currentInfo.title}</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
        {currentInfo.title}
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal">
        {currentInfo.subtitle}
      </p>
    </div>
  );
};
