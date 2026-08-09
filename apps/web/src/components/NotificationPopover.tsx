'use client';

import React from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { OrderDetailData } from '@/components/orders/OrderDetailModal';
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

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-3 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden transition-[opacity,transform] duration-150 animate-in fade-in zoom-in-95">
      {/* Header Bar */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
        <h3 className="font-extrabold text-gray-900 text-base font-display-lg">
          Thông báo
        </h3>
        <button
          type="button"
          onClick={notif.handleMarkAllRead}
          className="text-xs font-semibold text-gray-500 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          Đọc tất cả
        </button>
      </div>

      {/* Notification List Body */}
      <div className="max-h-[460px] overflow-y-auto divide-y divide-gray-100 modal-content">
        {notif.notifications.length === 0 ? (
          <div className="p-4">
            <EmptyState title="Không có thông báo nào" description="Bạn chưa có thông báo mới nào." />
          </div>
        ) : (
          notif.notifications.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => notif.handleNotificationClick(item)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && notif.handleNotificationClick(item)}
              className={`p-4 transition-colors cursor-pointer space-y-2.5 ${
                item.read ? 'bg-white hover:bg-gray-50' : 'bg-emerald-50/40 hover:bg-emerald-50/70'
              }`}
            >
              {/* Card Title & Icon */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-600 shrink-0"
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
                  <h4 className="font-bold text-gray-900 text-xs leading-snug">
                    {item.title}
                  </h4>
                </div>

                {!item.read && (
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0 mt-0.5" />
                )}
              </div>

              {/* Message Summary */}
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                {item.message}
              </p>

              {/* Key-Value Details Grid Box (For Order Notifications) */}
              {item.details && (
                <div className="bg-white/80 border border-gray-200/60 rounded-xl p-3 text-[11px] space-y-1.5 font-medium text-gray-700">
                  {item.details.orderCode && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Đơn hàng</span>
                      <span className="font-bold text-gray-900 font-mono">
                        {item.details.orderCode}
                      </span>
                    </div>
                  )}
                  {item.details.customerName && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Khách hàng</span>
                      <span className="font-semibold text-gray-800">
                        {item.details.customerName}
                      </span>
                    </div>
                  )}
                  {item.details.productSummary && (
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-400 shrink-0">Sản phẩm</span>
                      <span className="font-semibold text-gray-800 truncate text-right">
                        {item.details.productSummary}
                      </span>
                    </div>
                  )}
                  {item.details.totalAmount && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Giá trị</span>
                      <span className="font-extrabold text-gray-900 underline">
                        {item.details.totalAmount}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Timestamp Footer */}
              <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium pt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 text-gray-400"
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
