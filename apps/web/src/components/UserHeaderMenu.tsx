'use client';

import { useRef } from 'react';
import { NotificationPopover } from '@/components/NotificationPopover';
import { OrderDetailModal } from '@/components/orders/OrderDetailModal';
import { useUserHeaderMenu } from '@/hooks/useUserHeaderMenu';

type UserHeaderMenuProps = {
  profile: {
    fullName?: string;
    email?: string;
    rank?: string;
  } | null;
};

// Premium SVG flag icons
const VietnamFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 rounded-full border border-gray-100 shadow-xs shrink-0">
    <circle cx="12" cy="12" r="12" fill="#da251d" />
    <polygon points="12,6.5 13.5,11.2 18.5,11.2 14.5,14.2 16,19 12,16 8,19 9.5,14.2 5.5,11.2 10.5,11.2" fill="#ffff00" />
  </svg>
);

const UKFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 rounded-full border border-gray-100 shadow-xs shrink-0">
    <circle cx="12" cy="12" r="12" fill="#00247d" />
    <path d="M 0,0 L 24,24 M 24,0 L 0,24" stroke="#ffffff" strokeWidth="2.5" />
    <path d="M 0,0 L 24,24 M 24,0 L 0,24" stroke="#cf142b" strokeWidth="1.2" />
    <path d="M 12,0 V 24 M 0,12 H 24" stroke="#ffffff" strokeWidth="4" />
    <path d="M 12,0 V 24 M 0,12 H 24" stroke="#cf142b" strokeWidth="2.4" />
  </svg>
);

export const UserHeaderMenu = ({ profile }: UserHeaderMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const menu = useUserHeaderMenu(profile, menuRef);

  return (
    <div className="flex items-center gap-4 sm:gap-5" ref={menuRef}>
      {/* Shopping Cart Icon with MiniCart trigger */}
      <button
        type="button"
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('open_mini_cart'));
          }
        }}
        className="relative p-1 text-gray-600 hover:text-primary transition-colors cursor-pointer"
        title="Giỏ hàng"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {menu.mounted && menu.cartCount > 0 && (
          <span className="absolute -top-1 -right-1.5 min-w-[1.125rem] h-4.5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px] font-black border border-white px-1">
            {menu.cartCount}
          </span>
        )}
      </button>

      {/* Notification Bell Icon */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            menu.setIsNotifOpen(!menu.isNotifOpen);
            menu.setIsOpen(false);
          }}
          className="relative p-1 text-gray-600 hover:text-primary transition-colors cursor-pointer"
          title="Thông báo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {menu.unreadNotifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[0.625rem] h-2.5 bg-red-500 rounded-full border border-white" />
          )}
        </button>

        <NotificationPopover
          isOpen={menu.isNotifOpen}
          onClose={() => menu.setIsNotifOpen(false)}
          onSelectOrder={(order) => menu.setSelectedOrder(order)}
        />
      </div>

      {/* Hero Avatar Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            menu.setIsOpen(!menu.isOpen);
            menu.setShowLangMenu(false);
          }}
          className="w-9 h-9 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center font-bold text-sm shadow-xs transition-colors border border-emerald-800 focus:outline-none cursor-pointer"
        >
          {menu.initial}
        </button>

        {/* Dropdown Menu Card */}
        {menu.isOpen && (
          <div className="absolute right-0 mt-3 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100/80 py-3 z-50 transition-[opacity,transform] duration-150 animate-in fade-in zoom-in-95">
            {/* User Info Header */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                {menu.initial}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-gray-900 text-sm truncate">{menu.fullName}</p>
                <p className="text-xs text-gray-500 font-medium truncate">{menu.email}</p>
              </div>
            </div>

            {/* Quick Actions Navigation Items */}
            <ul className="text-xs font-semibold text-gray-700 pt-1.5 space-y-0.5">
              <li>
                <button
                  type="button"
                  onClick={() => menu.navigateToTab('info')}
                  className="w-full px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Tài khoản của tôi</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => menu.navigateToTab('orders')}
                  className="w-full px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Đơn hàng của tôi</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => menu.navigateToTab('assets')}
                  className="w-full px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Vườn sâm sở hữu</span>
                </button>
              </li>
            </ul>

            {/* Separator Line */}
            <div className="border-t border-gray-100 my-1.5"></div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => menu.setShowLangMenu(!menu.showLangMenu)}
                className="w-full px-5 py-2 flex items-center justify-between text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
                  </svg>
                  <span>{menu.locale === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${menu.showLangMenu ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Sub-menu Language Selection */}
              {menu.showLangMenu && (
                <div className="bg-gray-50/70 border-y border-gray-100 py-1 space-y-0.5 transition-opacity duration-150 animate-in fade-in">
                  <button
                    type="button"
                    onClick={() => menu.switchLocale('vi')}
                    className={`w-full px-8 py-1.5 flex items-center gap-2.5 text-[11px] font-semibold text-left transition-colors cursor-pointer ${
                      menu.locale === 'vi' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <VietnamFlag />
                    <span>Tiếng Việt (VI)</span>
                    {menu.locale === 'vi' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => menu.switchLocale('en')}
                    className={`w-full px-8 py-1.5 flex items-center gap-2.5 text-[11px] font-semibold text-left transition-colors cursor-pointer ${
                      menu.locale === 'en' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <UKFlag />
                    <span>English (EN)</span>
                    {menu.locale === 'en' && (
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
              type="button"
              onClick={menu.handleSignOut}
              className="w-full px-5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-3 text-left transition-colors font-bold text-xs cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>

      <OrderDetailModal order={menu.selectedOrder} onClose={() => menu.setSelectedOrder(null)} />
    </div>
  );
};
