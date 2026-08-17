'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { NotificationPopover } from '@/components/NotificationPopover';
import { useUserHeaderMenu } from '@/hooks/useUserHeaderMenu';

const OrderDetailModal = dynamic(
  () => import('@/components/orders/OrderDetailModal').then((mod) => mod.OrderDetailModal),
  { ssr: false },
);

type UserHeaderMenuProps = {
  profile: {
    fullName?: string;
    email?: string;
    rank?: string;
  } | null;
};

// Premium SVG flag icons
const VietnamFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-4 w-4 shrink-0 rounded-full border border-gray-100 shadow-xs"
  >
    <circle cx="12" cy="12" r="12" fill="#da251d" />
    <polygon
      points="12,6.5 13.5,11.2 18.5,11.2 14.5,14.2 16,19 12,16 8,19 9.5,14.2 5.5,11.2 10.5,11.2"
      fill="#ffff00"
    />
  </svg>
);

const UKFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-4 w-4 shrink-0 rounded-full border border-gray-100 shadow-xs"
  >
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
  const tNav = useTranslations('nav');
  const tSidebar = useTranslations('accountSidebar');
  const tNotif = useTranslations('notifications');
  const tLocale = useTranslations('LocaleSwitcher');
  const tCart = useTranslations('cart');

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
        className="relative cursor-pointer p-1 text-gray-600 transition-colors hover:text-primary"
        title={tCart('title')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5.5 w-5.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {menu.mounted && menu.cartCount > 0 && (
          <span className="absolute -top-1 -right-1.5 flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full border border-white bg-emerald-600 px-1 text-[10px] font-black text-white">
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
          className="relative cursor-pointer p-1 text-gray-600 transition-colors hover:text-primary"
          title={tNotif('title')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5.5 w-5.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {menu.unreadNotifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-2.5 min-w-[0.625rem] rounded-full border border-white bg-red-500" />
          )}
        </button>

        <NotificationPopover
          isOpen={menu.isNotifOpen}
          onClose={() => {
            menu.setIsNotifOpen(false);
          }}
          onSelectOrder={(order) => {
            menu.setSelectedOrder(order);
          }}
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
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-emerald-800 bg-primary text-sm font-bold text-white shadow-xs transition-colors hover:bg-primary-hover focus:outline-none"
        >
          {menu.initial}
        </button>

        {/* Dropdown Menu Card */}
        {menu.isOpen && (
          <div className="animate-in fade-in zoom-in-95 absolute right-0 z-50 mt-3 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-100/80 bg-white py-3 shadow-2xl transition-[opacity,transform] duration-150">
            {/* User Info Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white shadow-xs">
                {menu.initial}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-bold text-gray-900">{menu.fullName}</p>
                <p className="truncate text-xs font-medium text-gray-500">{menu.email}</p>
              </div>
            </div>

            {/* Quick Actions Navigation Items */}
            <ul className="space-y-0.5 pt-1.5 text-xs font-semibold text-gray-700">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    menu.navigateToTab('info');
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 shrink-0 text-emerald-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{tSidebar('info')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    menu.navigateToTab('orders');
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 shrink-0 text-emerald-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span>{tSidebar('orders')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    menu.navigateToTab('trees');
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 shrink-0 text-emerald-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span>{tSidebar('trees')}</span>
                </button>
              </li>
            </ul>

            {/* Separator Line */}
            <div className="my-1.5 border-t border-gray-100" />

            {/* Language Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  menu.setShowLangMenu(!menu.showLangMenu);
                }}
                className="flex w-full cursor-pointer items-center justify-between px-5 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.6 9h16.8M3.6 15h16.8"
                    />
                  </svg>
                  <span>{menu.locale === 'vi' ? tLocale('vi') : tLocale('en')}</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${menu.showLangMenu ? 'rotate-90' : ''}`}
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
                <div className="animate-in fade-in space-y-0.5 border-y border-gray-100 bg-gray-50/70 py-1 transition-opacity duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      menu.switchLocale('vi');
                    }}
                    className={`flex w-full cursor-pointer items-center gap-2.5 px-8 py-1.5 text-left text-[11px] font-semibold transition-colors ${
                      menu.locale === 'vi'
                        ? 'bg-emerald-50/50 font-bold text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <VietnamFlag />
                    <span>{tLocale('vi')} (VI)</span>
                    {menu.locale === 'vi' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-auto h-3.5 w-3.5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      menu.switchLocale('en');
                    }}
                    className={`flex w-full cursor-pointer items-center gap-2.5 px-8 py-1.5 text-left text-[11px] font-semibold transition-colors ${
                      menu.locale === 'en'
                        ? 'bg-emerald-50/50 font-bold text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <UKFlag />
                    <span>{tLocale('en')} (EN)</span>
                    {menu.locale === 'en' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-auto h-3.5 w-3.5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Separator Line */}
            <div className="my-1.5 border-t border-gray-100" />

            {/* Sign Out Item in Red */}
            <button
              type="button"
              onClick={menu.handleSignOut}
              className="flex w-full cursor-pointer items-center gap-3 px-5 py-2 text-left text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>{tNav('signOut')}</span>
            </button>
          </div>
        )}
      </div>

      <OrderDetailModal
        order={menu.selectedOrder}
        onClose={() => {
          menu.setSelectedOrder(null);
        }}
      />
    </div>
  );
};
