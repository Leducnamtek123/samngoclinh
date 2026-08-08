'use client';

import React from 'react';

type AccountContentProps = {
  activeTab: string;
  children: React.ReactNode;
};

export const AccountContent: React.FC<AccountContentProps> = ({
  activeTab,
  children,
}) => {
  return (
    <div
      key={activeTab}
      className="w-full transition-all duration-200 animate-in fade-in-50 slide-in-from-bottom-2"
    >
      {children}
    </div>
  );
};
