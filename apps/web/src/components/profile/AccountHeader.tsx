'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

type AccountHeaderProps = {
  activeTab: string;
};

export const AccountHeader: React.FC<AccountHeaderProps> = ({ activeTab }) => {
  const tSidebar = useTranslations('accountSidebar');
  const tNav = useTranslations('nav');

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'info': {
        return tSidebar('info');
      }
      case 'orders': {
        return tSidebar('orders');
      }
      case 'assets':
      case 'trees': {
        return tSidebar('trees');
      }
      case 'address': {
        return tSidebar('addresses');
      }
      case 'kyc': {
        return tSidebar('kyc');
      }
      case 'contracts': {
        return tSidebar('contracts');
      }
      case 'referral': {
        return tSidebar('referral');
      }
      case 'settings': {
        return tSidebar('settings');
      }
      case 'change-password':
      case 'security': {
        return tSidebar('security');
      }
      case 'digital-signature': {
        return tSidebar('digitalSignature');
      }
      default: {
        return tNav('profile');
      }
    }
  };

  const title = getTabTitle(activeTab);

  return (
    <div className="mb-6 flex flex-col gap-1 px-1">
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
        <span>{tNav('profile')}</span>
        <span className="text-gray-300 dark:text-gray-700">/</span>
        <span className="text-gray-600 capitalize dark:text-gray-400">{title}</span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {title}
      </h1>
    </div>
  );
};
