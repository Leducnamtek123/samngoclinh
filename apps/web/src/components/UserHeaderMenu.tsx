'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/libs/I18nNavigation';

type UserHeaderMenuProps = {
  profile: {
    fullName?: string;
    email?: string;
    rank?: string;
  } | null;
};

// Premium SVG flag icons
const VietnamFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 rounded-full border border-gray-100 shadow-sm flex-shrink-0">
    <circle cx="12" cy="12" r="12" fill="#da251d" />
    <polygon points="12,6.5 13.5,11.2 18.5,11.2 14.5,14.2 16,19 12,16 8,19 9.5,14.2 5.5,11.2 10.5,11.2" fill="#ffff00" />
  </svg>
);

const UKFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 rounded-full border border-gray-100 shadow-sm flex-shrink-0">
    <circle cx="12" cy="12" r="12" fill="#00247d" />
    <path d="M 0,0 L 24,24 M 24,0 L 0,24" stroke="#ffffff" strokeWidth="2.5" />
    <path d="M 0,0 L 24,24 M 24,0 L 0,24" stroke="#cf142b" strokeWidth="1.2" />
    <path d="M 12,0 V 24 M 0,12 H 24" stroke="#ffffff" strokeWidth="4" />
    <path d="M 12,0 V 24 M 0,12 H 24" stroke="#cf142b" strokeWidth="2.4" />
  </svg>
);

export const UserHeaderMenu = ({ profile }: UserHeaderMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const fullName = profile?.fullName || 'Khách hàng';
  const email = profile?.email || 'user@mail.com';
  const initial = fullName.charAt(0).toUpperCase();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowLangMenu(false);
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
    window.location.href = `/${locale}/profile?tabs=${tabName}`;
    setIsOpen(false);
  };

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    const { search } = window.location;
    router.push(`${pathname}${search}`, { locale: newLocale, scroll: false });
    setIsOpen(false);
    setShowLangMenu(false);
  };

  return (
    <div className="flex items-center gap-4 sm:gap-5" ref={menuRef}>
      {/* Shopping Cart Icon */}
      <a href={`/${locale}/cart`} className="relative p-1 text-gray-600 hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </a>

      {/* Notification Bell Icon with Badge */}
      <a href={`/${locale}/profile?tabs=info`} className="relative p-1 text-gray-600 hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute -top-1 -right-1.5 w-4.5 h-4.5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border border-white">
          7
        </span>
      </a>

      {/* Hero Avatar Button */}
      <div className="relative">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowLangMenu(false);
          }}
          className="w-9 h-9 rounded-full bg-[#1C3F24] hover:bg-emerald-900 text-white flex items-center justify-center font-bold text-sm shadow-sm transition-colors border border-emerald-800 focus:outline-none cursor-pointer"
        >
          {initial}
        </button>

        {/* Dropdown Menu Card */}
        {isOpen && (
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* User Info Header */}
            <div className="px-5 py-2.5 border-b border-gray-100">
              <p className="font-extrabold text-gray-900 text-sm">{fullName}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">{email}</p>
              <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-2 uppercase tracking-wider">
                Khách hàng
              </span>
            </div>

            {/* Main Navigation Items */}
            <ul className="text-xs font-semibold text-gray-700 pt-1.5">
              <li>
                <button
                  onClick={() => navigateToTab('info')}
                  className="w-full px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Hồ sơ</span>
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
                  <span>Đơn hàng</span>
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
                  <span>Tài sản</span>
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
                  <span>Căn cước công dân</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToTab('referral')}
                  className="w-full px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Giới thiệu bạn bè</span>
                </button>
              </li>
            </ul>

            {/* Separator Line */}
            <div className="border-t border-gray-100 my-1.5"></div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="w-full px-5 py-2 flex items-center justify-between text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
                  </svg>
                  <span>{locale === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showLangMenu ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Sub-menu Language Selection */}
              {showLangMenu && (
                <div className="bg-gray-50/70 border-y border-gray-100 py-1 space-y-0.5 animate-in fade-in duration-150">
                  <button
                    onClick={() => switchLocale('vi')}
                    className={`w-full px-8 py-1.5 flex items-center gap-2.5 text-[11px] font-semibold text-left transition-colors ${
                      locale === 'vi' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <VietnamFlag />
                    <span>Tiếng Việt (VI)</span>
                    {locale === 'vi' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => switchLocale('en')}
                    className={`w-full px-8 py-1.5 flex items-center gap-2.5 text-[11px] font-semibold text-left transition-colors ${
                      locale === 'en' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <UKFlag />
                    <span>English (EN)</span>
                    {locale === 'en' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Separator Line */}
            <div className="border-t border-gray-100 my-1.5"></div>

            {/* Sign Out Item in Red */}
            <button
              onClick={handleSignOut}
              className="w-full px-5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-3 text-left transition-colors font-bold text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
