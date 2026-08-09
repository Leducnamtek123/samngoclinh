import { useState, useMemo } from 'react';
import { Link } from '@/lib/I18nNavigation';

type ProfileOrdersTabProps = {
  ordersLoading: boolean;
  safeOrders: any[];
  onViewDetail: (ord: any) => void;
  onPayOrder: (ord: any) => void;
};

export const getOrderStatusInfo = (statusRaw?: string) => {
  const status = (statusRaw || '').toLowerCase();
  switch (status) {
    case 'pending':
      return {
        label: 'Chờ thanh toán',
        badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200',
        solidClass: 'bg-amber-500 text-white',
        canPay: true,
      };
    case 'paid':
      return {
        label: 'Đã thanh toán',
        badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
        solidClass: 'bg-emerald-600 text-white',
        canPay: false,
      };
    case 'processing':
    case 'confirmed':
      return {
        label: 'Đã xác nhận / Đang chuẩn bị',
        badgeClass: 'bg-blue-100 text-blue-800 border border-blue-200',
        solidClass: 'bg-blue-600 text-white',
        canPay: false,
      };
    case 'shipping':
    case 'delivering':
      return {
        label: 'Đang giao hàng',
        badgeClass: 'bg-purple-100 text-purple-800 border border-purple-200',
        solidClass: 'bg-purple-600 text-white',
        canPay: false,
      };
    case 'completed':
    case 'delivered':
    case 'success':
      return {
        label: 'Đã giao / Hoàn thành',
        badgeClass: 'bg-teal-100 text-teal-800 border border-teal-200',
        solidClass: 'bg-teal-600 text-white',
        canPay: false,
      };
    case 'cancelled':
      return {
        label: 'Đã hủy đơn',
        badgeClass: 'bg-gray-100 text-gray-600 border border-gray-200',
        solidClass: 'bg-gray-400 text-white',
        canPay: false,
      };
    default:
      return {
        label: statusRaw || 'Không xác định',
        badgeClass: 'bg-gray-100 text-gray-700 border border-gray-200',
        solidClass: 'bg-gray-500 text-white',
        canPay: false,
      };
  }
};

export const ProfileOrdersTab = ({
  ordersLoading,
  safeOrders,
  onViewDetail,
  onPayOrder,
}: ProfileOrdersTabProps) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterCounts = useMemo(() => {
    const counts = {
      all: safeOrders.length,
      pending: 0,
      paid: 0,
      shipping: 0,
      completed: 0,
      cancelled: 0,
    };

    safeOrders.forEach((ord) => {
      const s = (ord.status || '').toLowerCase();
      if (s === 'pending') counts.pending++;
      else if (s === 'paid') counts.paid++;
      else if (s === 'shipping' || s === 'delivering' || s === 'processing' || s === 'confirmed') counts.shipping++;
      else if (s === 'completed' || s === 'delivered' || s === 'success') counts.completed++;
      else if (s === 'cancelled') counts.cancelled++;
    });

    return counts;
  }, [safeOrders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'all') return safeOrders;
    return safeOrders.filter((ord) => {
      const s = (ord.status || '').toLowerCase();
      if (activeFilter === 'pending') return s === 'pending';
      if (activeFilter === 'paid') return s === 'paid';
      if (activeFilter === 'shipping') return ['shipping', 'delivering', 'processing', 'confirmed'].includes(s);
      if (activeFilter === 'completed') return ['completed', 'delivered', 'success'].includes(s);
      if (activeFilter === 'cancelled') return s === 'cancelled';
      return true;
    });
  }, [safeOrders, activeFilter]);

  const tabs = [
    { id: 'all', label: 'Tất cả', count: filterCounts.all },
    { id: 'pending', label: 'Chờ thanh toán', count: filterCounts.pending },
    { id: 'paid', label: 'Đã thanh toán', count: filterCounts.paid },
    { id: 'shipping', label: 'Đang giao hàng', count: filterCounts.shipping },
    { id: 'completed', label: 'Đã giao / Hoàn thành', count: filterCounts.completed },
    { id: 'cancelled', label: 'Đã hủy', count: filterCounts.cancelled },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Lịch sử đơn hàng</h3>
        <p className="text-xs text-gray-400 font-medium">Theo dõi tiến độ đơn hàng và danh sách các gói sản phẩm sâm Ngọc Linh</p>
      </div>

      {/* Filter Tabs Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-200 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                isActive ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {ordersLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 bg-gray-100 rounded-xl"></div>
          <div className="h-16 bg-gray-100 rounded-xl"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center space-y-3">
          <p className="text-sm text-gray-500">Không có đơn hàng nào ở trạng thái này.</p>
          <Link href="/ginseng" className="inline-block bg-primary text-white hover:bg-primary-hover px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm">
            Ghé Cửa hàng ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const safeItems = Array.isArray(ord?.items) ? ord.items : [];
            const statusInfo = getOrderStatusInfo(ord.status);

            const itemSum = safeItems.reduce((acc: number, item: any) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
            const finalTotal = Number(ord.totalAmount) || Number(ord.total) || itemSum;

            return (
              <div key={ord.id || ord.code} className="border border-gray-200 rounded-xl p-5 space-y-3 bg-white shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div>
                    <span className="font-bold text-gray-900 text-sm">Đơn hàng #{ord.code || ord.id}</span>
                    <span className="text-xs text-gray-400 block">{ord.createdAt}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase ${statusInfo.badgeClass}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {safeItems.map((item: any) => (
                  <div key={item.id || item.productId || item.name} className="flex justify-between items-center text-xs font-medium text-gray-700">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>{((item.price || 0) * (item.quantity || 1)).toLocaleString('vi-VN')} đ</span>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-900">
                    Tổng tiền: <strong className="text-emerald-800 text-sm font-black">{finalTotal.toLocaleString('vi-VN')} đ</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetail(ord)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Chi tiết đơn hàng
                    </button>
                    {statusInfo.canPay && (
                      <button
                        type="button"
                        onClick={() => onPayOrder(ord)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Thanh toán
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
