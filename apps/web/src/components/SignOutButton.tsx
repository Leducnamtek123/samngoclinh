'use client';

import React from 'react';

export const SignOutButton = ({ children }: { children: React.ReactNode }) => {
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' });
      window.location.href = '/';
    } catch (e) {
      console.error('Sign-out error:', e);
      window.location.href = '/';
    }
  };

  return (
    <div onClick={handleSignOut} className="cursor-pointer">
      {children}
    </div>
  );
};
