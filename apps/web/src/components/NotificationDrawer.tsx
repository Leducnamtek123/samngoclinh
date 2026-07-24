'use client';

import { useState } from 'react';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'tree' | 'system';
};

type NotificationDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const NotificationDrawer = ({ isOpen, onClose }: NotificationDrawerProps) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'NOTIF-1',
      title: 'Xác nhận đơn hàng',
      message: 'Đơn hàng #ORD-1721839 của bạn đã được khởi tạo thành công.',
      timestamp: '10 phút trước',
      read: false,
      type: 'order',
    },
    {
      id: 'NOTIF-2',
      title: 'Cập nhật vườn sâm',
      message: 'Cây sâm mã TR-SN-001 tại vườn Trà Linh đã hoàn thành đợt bón phân định kỳ.',
      timestamp: '2 giờ trước',
      read: false,
      type: 'tree',
    },
    {
      id: 'NOTIF-3',
      title: 'Ưu đãi thành viên',
      message: 'Chúc mừng bạn đã đạt hạng Đồng! Nhận ngay 100 điểm thưởng.',
      timestamp: '1 ngày trước',
      read: true,
      type: 'system',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const filtered = activeTab === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-gray-900 text-base">Thông báo</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {unreadCount} mới
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Filters & Action Bar */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                activeTab === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                activeTab === 'unread' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-emerald-700 font-bold hover:underline text-[11px]">
              Đọc tất cả
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400 space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-xs font-semibold">Không có thông báo nào</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-3.5 rounded-xl transition-all cursor-pointer space-y-1 ${
                  item.read ? 'bg-white hover:bg-gray-50' : 'bg-emerald-50/40 hover:bg-emerald-50/70 border-l-4 border-emerald-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-xs">{item.title}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{item.timestamp}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">{item.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
          <p className="text-[11px] text-gray-400 font-medium">Hệ thống thông báo Sâm Ngọc Linh</p>
        </div>
      </div>
    </div>
  );
};
