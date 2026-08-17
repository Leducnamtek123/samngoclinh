'use client';

import type { UserProfile } from '@/types';
import { AccountContent } from './AccountContent';
import { AccountHeader } from './AccountHeader';
import { AccountSidebar } from './AccountSidebar';

type AccountLayoutProps = {
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  profile?: UserProfile | null;
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
}) => (
  <div className="min-h-[calc(100vh-12rem)] bg-gray-50/60 py-6 sm:py-10">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        {/* Left Sidebar (280px on desktop) */}
        <AccountSidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          profile={profile}
          treesCount={treesCount}
          contractsCount={contractsCount}
        />

        {/* Right Main Content Panel */}
        <main className="w-full min-w-0 flex-1">
          <AccountHeader activeTab={activeTab} />
          <AccountContent activeTab={activeTab}>{children}</AccountContent>
        </main>
      </div>
    </div>
  </div>
);
