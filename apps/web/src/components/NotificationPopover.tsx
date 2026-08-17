'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import type { OrderDetailData } from '@/components/orders/OrderDetailModal';
import { useNotificationPopover } from '@/hooks/useNotificationPopover';

type NotificationPopoverProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder: (order: OrderDetailData) => void;
};

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  onSelectOrder,
}) => {
  const notif = useNotificationPopover(isOpen, onClose, onSelectOrder);
  const tNotif = useTranslations('notifications');
  const tCart = useTranslations('cart');
  const tProfile = useTranslations('profile');

  if (!isOpen) {
    return null;
  }

  return (
    <div className="animate-in fade-in zoom-in-95 absolute right-0 z-50 mt-3 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-[opacity,transform] duration-150">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
        <h3 className="font-display-lg text-base font-extrabold text-gray-900">
          {tNotif('title')}
        </h3>
        <button
          type="button"
          onClick={notif.handleMarkAllRead}
          className="cursor-pointer text-xs font-semibold text-gray-500 transition-colors hover:text-emerald-700"
        >
          {tNotif('markAllRead')}
        </button>
      </div>

      {/* Notification List Body */}
      <div className="modal-content max-h-[460px] divide-y divide-gray-100 overflow-y-auto">
        {notif.notifications.length === 0 ? (
          <div className="p-4">
            <EmptyState title={tNotif('noNotifications')} description={tNotif('emptyDesc')} />
          </div>
        ) : (
          notif.notifications.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                notif.handleNotificationClick(item);
              }}
              onKeyDown={(e) =>
                (e.key === 'Enter' || e.key === ' ') && notif.handleNotificationClick(item)
              }
              className={`cursor-pointer space-y-2.5 p-4 transition-colors ${
                item.read ? 'bg-white hover:bg-gray-50' : 'bg-emerald-50/40 hover:bg-emerald-50/70'
              }`}
            >
              {/* Card Title & Icon */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 shrink-0 text-gray-600"
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
                  <h4 className="text-xs leading-snug font-bold text-gray-900">
                    {String(item.title || '')}
                  </h4>
                </div>

                {!item.read && (
                  <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                )}
              </div>

              {/* Message Summary */}
              <p className="text-xs leading-relaxed font-normal text-gray-600">
                {String(item.message || '')}
              </p>

              {/* Key-Value Details Grid Box (For Order Notifications) */}
              {item.details && typeof item.details === 'object' && (
                <div className="space-y-1.5 rounded-xl border border-gray-200/60 bg-white/80 p-3 text-[11px] font-medium text-gray-700">
                  {Boolean((item.details as Record<string, unknown>).orderCode) && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">{tProfile('orderCode')}</span>
                      <span className="font-mono font-bold text-gray-900">
                        {String((item.details as Record<string, unknown>).orderCode)}
                      </span>
                    </div>
                  )}
                  {Boolean((item.details as Record<string, unknown>).customerName) && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">{tProfile('fullName')}</span>
                      <span className="font-semibold text-gray-800">
                        {String((item.details as Record<string, unknown>).customerName)}
                      </span>
                    </div>
                  )}
                  {Boolean((item.details as Record<string, unknown>).productSummary) && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="shrink-0 text-gray-400">{tCart('product')}</span>
                      <span className="truncate text-right font-semibold text-gray-800">
                        {String((item.details as Record<string, unknown>).productSummary)}
                      </span>
                    </div>
                  )}
                  {Boolean((item.details as Record<string, unknown>).totalAmount) && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">{tCart('total')}</span>
                      <span className="font-extrabold text-gray-900 underline">
                        {String((item.details as Record<string, unknown>).totalAmount)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Timestamp Footer */}
              <div className="flex items-center gap-1 pt-0.5 text-[11px] font-medium text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{item.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
