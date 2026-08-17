'use client';

import React from 'react';

type AccountContentProps = {
  activeTab: string;
  children: React.ReactNode;
};

export const AccountContent: React.FC<AccountContentProps> = ({ activeTab, children }) => (
  <div
    key={activeTab}
    className="animate-in fade-in-50 slide-in-from-bottom-2 w-full transition-opacity duration-200"
  >
    {children}
  </div>
);
