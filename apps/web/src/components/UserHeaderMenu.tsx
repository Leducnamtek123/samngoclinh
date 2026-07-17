'use client';

import { useState, useEffect, useRef } from 'react';

type UserHeaderMenuProps = {
  profile: {
    fullName?: string;
    email?: string;
    rank?: string;
  } | null;
};

export const UserHeaderMenu = ({ profile }: UserHeaderMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fullName = profile?.fullName || 'Khách hàng';
  const email = profile?.email || '';
  const initial = fullName.charAt(0).toUpperCase();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' });
      window.location.href = '/';
    } catch (e) {
      console.error('Sign-out error:', e);
      window.location.href = '/';
    }
  };

  const navigateToTab = (tabName: string) => {
    window.location.href = `/profile?tabs=${tabName}`;
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-5" ref={menuRef}>
      {/* Shopping Cart Icon */}
      <a href="/dashboard/" className="relative p-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 text-gray-500 hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </a>

      {/* Notification Bell Icon with Badge 7 */}
      <a href="/dashboard/" className="relative p-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 text-gray-500 hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow border border-white">
          7
        </span>
      </a>

      {/* Green Circle Avatar */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-[#4CAF50] text-white flex items-center justify-center font-bold text-lg shadow-sm hover:opacity-95 transition-opacity focus:outline-none border border-emerald-600/10"
        >
          {initial}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-3.5 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header info */}
            <div className="px-5 py-2 space-y-1.5">
              <div className="font-bold text-gray-900 text-sm leading-none">{fullName}</div>
              <div className="text-xs text-gray-400 font-medium truncate max-w-full">{email}</div>
              <span className="inline-block text-[10px] font-bold text-gray-500 border border-gray-200 px-2.5 py-0.5 rounded-full bg-gray-50">
                Khách hàng
              </span>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-100 my-2"></div>

            {/* Menu Items */}
            <ul className="text-sm font-semibold text-gray-700 space-y-0.5">
              <li>
                <button
                  onClick={() => navigateToTab('info')}
                  className="w-full px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Hồ sơ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToTab('orders')}
                  className="w-full px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Đơn hàng
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToTab('assets')}
                  className="w-full px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Tài sản
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToTab('kyc')}
                  className="w-full px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0l1.8-1.8A2 2 0 0113 4h4a2 2 0 012 2v1M9 13h6m-6 3h3" />
                  </svg>
                  Căn cước công dân
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToTab('referral')}
                  className="w-full px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm-2 4h4a2 2 0 012 2v6a2 2 0 01-2 2h-4a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                  </svg>
                  Giới thiệu bạn bè
                </button>
              </li>
            </ul>

            {/* Separator */}
            <div className="border-t border-gray-100 my-2"></div>

            {/* Language switch mock */}
            <div className="px-5 py-2 flex items-center justify-between text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>Tiếng Việt</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-100 my-2"></div>

            {/* Logout button */}
            <button
              onClick={handleSignOut}
              className="w-full px-5 py-2 hover:bg-red-50 text-gray-700 hover:text-red-700 flex items-center gap-3 text-left transition-colors font-bold text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
