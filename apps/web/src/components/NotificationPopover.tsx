'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { OrderDetailData } from '@/components/OrderDetailModal';

export type NotificationItem = {
  id: string;
  type: 'order' | 'tree' | 'contract' | 'system';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  details?: {
    orderCode?: string;
    customerName?: string;
    productSummary?: string;
    totalAmount?: string;
  };
  orderPayload?: OrderDetailData;
};

type NotificationPopoverProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder: (order: OrderDetailData) => void;
};

export const NotificationPopover = ({
  isOpen,
  onClose,
  onSelectOrder,
}: NotificationPopoverProps) => {
  const locale = useLocale();
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'NOTIF-ORD-1',
      type: 'order',
      title: '🛒 Đơn hàng mới thanh toán online',
      message:
        'Đơn hàng #ORD178489580790129 của Trần Thị Thanh Trang gồm Cây Sâm Ngọc Linh 2026 ×6 (962.394 đ) đã được tạo với tổng tiền 1.032.330 đ và đang chờ thanh toán...',
      read: false,
      timestamp: 'khoảng 6 giờ trước',
      details: {
        orderCode: '#ORD178489580790129',
        customerName: 'Trần Thị Thanh Trang',
        productSummary: 'Cây Sâm Ngọc Linh 2026 ×6 (962.394 đ)',
        totalAmount: '1.032.330 đ',
      },
      orderPayload: {
        code: 'ORD178489580790129',
        createdAt: '2026-07-24 18:30',
        status: 'PAID',
        totalAmount: 1032330,
        user: {
          fullName: 'Trần Thị Thanh Trang',
          email: 'thanhtrang@gmail.com',
          phone: '0909004740',
        },
        items: [
          {
            name: 'Cây Sâm Ngọc Linh 2026',
            quantity: 6,
            price: 962394,
            treePrice: 86834,
            careFee: 50800,
            protectionFee: 21709,
            imageUrl: '/assets/images/kon_tum_ginseng.png',
          },
        ],
        shippingMethod: 'Nhận trực tiếp tại vườn',
        paymentMethod: 'Thanh toán trực tuyến',
      },
    },
    {
      id: 'NOTIF-ORD-2',
      type: 'order',
      title: '🛒 Đơn hàng mới thanh toán online',
      message:
        'Đơn hàng #ORD1784895360511504 của Trần Thị Thanh Trang gồm Cây Sâm Ngọc Linh 2026 ×1 (72.720 đ) đã được tạo với tổng tiền 79.992 đ và đang chờ thanh toán...',
      read: false,
      timestamp: 'khoảng 6 giờ trước',
      details: {
        orderCode: '#ORD1784895360511504',
        customerName: 'Trần Thị Thanh Trang',
        productSummary: 'Cây Sâm Ngọc Linh 2026 ×1 (72.720 đ)',
        totalAmount: '79.992 đ',
      },
      orderPayload: {
        code: 'ORD1784895360511504',
        createdAt: '2026-07-24 18:00',
        status: 'PENDING',
        totalAmount: 79992,
        user: {
          fullName: 'Trần Thị Thanh Trang',
          email: 'thanhtrang@gmail.com',
          phone: '0909004740',
        },
        items: [
          {
            name: 'Cây Sâm Ngọc Linh 2026',
            quantity: 1,
            price: 72720,
            treePrice: 45000,
            careFee: 20000,
            protectionFee: 7720,
            imageUrl: '/assets/images/kon_tum_ginseng.png',
          },
        ],
        shippingMethod: 'Nhận trực tiếp tại vườn',
        paymentMethod: 'Thanh toán qua VietQR',
      },
    },
    {
      id: 'NOTIF-TREE-1',
      type: 'tree',
      title: '🌱 Cây sâm Ngọc Linh đã được trồng thành công',
      message:
        'Cây sâm mã #SAM-0128 của bạn tại Vườn Kon Tum đã hoàn tất quy trình gieo trồng và bảo vệ định kỳ.',
      read: true,
      timestamp: '1 ngày trước',
    },
  ]);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    onClose();

    if (item.type === 'order' && item.orderPayload) {
      onSelectOrder(item.orderPayload);
    } else if (item.type === 'tree') {
      router.push(`/${locale}/profile?tabs=trees`);
    } else if (item.type === 'contract') {
      router.push(`/${locale}/profile?tabs=contracts`);
    } else {
      router.push(`/${locale}/profile?tabs=info`);
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden transition-[opacity,transform] duration-150 animate-in fade-in zoom-in-95">
      {/* Header Bar */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
        <h3 className="font-extrabold text-gray-900 text-base font-display-lg">
          Thông báo
        </h3>
        <button
          type="button"
          onClick={markAllAsRead}
          className="text-xs font-semibold text-gray-500 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          Đọc tất cả
        </button>
      </div>

      {/* Notification List Body */}
      <div className="max-h-[460px] overflow-y-auto divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs font-medium">
            Không có thông báo nào.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => handleNotificationClick(item)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNotificationClick(item)}
              className={`p-4 transition-colors cursor-pointer space-y-2.5 ${
                item.read ? 'bg-white hover:bg-gray-50' : 'bg-[#F4F8F5] hover:bg-emerald-50/70'
              }`}
            >
              {/* Card Title & Icon */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-600 flex-shrink-0"
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
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 mt-0.5"></span>
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
                      <span className="text-gray-400 flex-shrink-0">Sản phẩm</span>
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
