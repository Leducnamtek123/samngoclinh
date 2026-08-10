'use client';

import React from 'react';
import { AccountSidebar } from './AccountSidebar';
import { AccountHeader } from './AccountHeader';
import { AccountContent } from './AccountContent';

type AccountLayoutProps = {
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  profile?: any;
  treesCount?: number;
  contractsCount?: number;
  children: React.ReactNode;
};

export const AccountLayout: React.FC<AccountLayoutProps> = ({
  activeTab,
  onSelectTab,
  profile,
  treesCount,
  contractsCount,
  children,
}) => {
  return (
    <div className="min-h-[calc(100vh-12rem)] bg-gray-50/60 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar (280px on desktop) */}
          <AccountSidebar
            activeTab={activeTab}
            onSelectTab={onSelectTab}
            profile={profile}
            treesCount={treesCount}
            contractsCount={contractsCount}
          />

          {/* Right Main Content Panel */}
          <main className="flex-1 w-full min-w-0">
            <AccountHeader activeTab={activeTab} />
            <AccountContent activeTab={activeTab}>{children}</AccountContent>
          </main>
        </div>
      </div>
    </div>
  );
};
