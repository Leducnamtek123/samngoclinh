import { useEffect } from 'react';
import { Link } from '@/lib/I18nNavigation';
import { Button, Badge } from '@/components/ui';
import { EmptyState, LoadingState, ErrorState } from '@/components/common';
import { ShoppingBag } from 'lucide-react';
import { formatVNDPrice } from '@/utils/formatters';
import { formatLocalDateTime } from '@/utils/datetime';
import type { StatusCounts, PaginationMeta } from '@/hooks/useProfileOrders';

import type { Order } from '@/types';

type ProfileOrdersTabProps = {
  ordersLoading: boolean;
  ordersError?: string | null;
  safeOrders: Order[];
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  statusCounts: StatusCounts;
  pagination: PaginationMeta;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onViewDetail: (ord: Order) => void;
  onPayOrder: (ord: Order) => void;
  onRetry?: () => void;
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
    case 'pending_verification':
    case 'verifying':
    case 'checking':
      return {
        label: 'Chờ xác thực thanh toán',
        badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
        solidClass: 'bg-amber-600 text-white',
        canPay: false,
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
  ordersError,
  safeOrders,
  statusFilter,
  onStatusFilterChange,
  statusCounts,
  hasMore,
  onLoadMore,
  onViewDetail,
  onPayOrder,
  onRetry,
}: ProfileOrdersTabProps) => {
  const tabs = [
    { id: 'all', label: 'Tất cả', count: statusCounts.all },
    { id: 'pending', label: 'Chờ thanh toán', count: statusFilter === 'pending' ? Math.max(statusCounts.pending || 0, safeOrders.length) : statusCounts.pending },
    { id: 'paid', label: 'Đã thanh toán', count: statusFilter === 'paid' ? Math.max(statusCounts.paid || 0, safeOrders.length) : statusCounts.paid },
    { id: 'shipping', label: 'Đang giao hàng', count: statusFilter === 'shipping' ? Math.max(statusCounts.shipping || 0, safeOrders.length) : statusCounts.shipping },
    { id: 'completed', label: 'Đã giao / Hoàn thành', count: statusFilter === 'completed' ? Math.max(statusCounts.completed || 0, safeOrders.length) : statusCounts.completed },
    { id: 'cancelled', label: 'Đã hủy', count: statusFilter === 'cancelled' ? Math.max(statusCounts.cancelled || 0, safeOrders.length) : statusCounts.cancelled },
  ];

  // Infinite scroll observer setup
  useEffect(() => {
    if (!hasMore || ordersLoading || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const target = document.getElementById('infinite-scroll-trigger');
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [hasMore, ordersLoading, onLoadMore]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Lịch sử đơn hàng</h3>
        <p className="text-xs text-gray-400 font-medium">Theo dõi tiến độ đơn hàng và danh sách các gói sản phẩm sâm Ngọc Linh</p>
      </div>

      {/* Filter Tabs Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-200 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          // Shopee Rule: 'all' tab never shows count. Other tabs show count ONLY if > 0.
          const showBadge = tab.id !== 'all' && (tab.count ?? 0) > 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusFilterChange(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              {showBadge && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-emerald-800 text-white' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                }`}>
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {ordersLoading && safeOrders.length === 0 ? (
        <LoadingState variant="centered" message="Đang tải lịch sử đơn hàng..." />
      ) : ordersError ? (
        <ErrorState
          title="Không thể tải đơn hàng"
          message={ordersError}
          onRetry={onRetry}
        />
      ) : safeOrders.length === 0 ? (
        <EmptyState
          title="Không có đơn hàng"
          description="Không có đơn hàng nào ở trạng thái này."
          icon={ShoppingBag}
        >
          <Button asChild variant="default" className="mt-2">
            <Link href="/ginseng">Ghé Cửa hàng ngay</Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {safeOrders.map((ord) => {
              const safeItems = Array.isArray(ord?.items) ? ord.items : [];
              const statusInfo = getOrderStatusInfo(ord.status);
              const finalTotal = ord.totalAmount != null ? Number(ord.totalAmount) : (ord.total != null ? Number(ord.total) : null);

              return (
                <div key={ord.id || ord.code} className="border border-gray-200 rounded-xl p-5 space-y-3 bg-white shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <span className="font-bold text-gray-900 text-sm">Đơn hàng #{ord.code || ord.id}</span>
                      <span className="text-xs text-gray-400 block mt-0.5">{formatLocalDateTime(ord.createdAt)}</span>
                    </div>
                    <Badge variant="secondary" className={statusInfo.badgeClass}>
                      {statusInfo.label}
                    </Badge>
                  </div>

                  {safeItems.length > 0 && safeItems.map((item: any, idx: number) => (
                    <div key={item.id || item.productId || item.name || idx} className="flex justify-between items-center text-xs font-medium text-gray-700">
                      <span>{item.name || 'Sản phẩm'} (x{item.quantity ?? 1})</span>
                      <span>{item.price != null ? formatVNDPrice(Number(item.price) * Number(item.quantity ?? 1)) : '—'}</span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-900">
                      Tổng tiền: <strong className="text-emerald-800 text-sm font-black">{finalTotal != null ? formatVNDPrice(finalTotal) : '—'}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewDetail(ord)}
                      >
                        Chi tiết đơn hàng
                      </Button>
                      {statusInfo.canPay && (
                        <Button
                          type="button"
                          variant="emerald"
                          size="sm"
                          onClick={() => onPayOrder(ord)}
                        >
                          Thanh toán
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Shopee-style Infinite Scroll Loading Trigger & Bottom Indicator */}
          {hasMore && (
            <div id="infinite-scroll-trigger" className="py-4 text-center">
              {ordersLoading ? (
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span>Đang tải thêm đơn hàng...</span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLoadMore}
                  className="text-xs font-bold text-emerald-800 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100"
                >
                  Tải thêm đơn hàng
                </Button>
              )}
            </div>
          )}

          {!hasMore && safeOrders.length > 0 && (
            <p className="text-center text-xs text-gray-400 font-medium py-3 border-t border-gray-100">
              Đã hiển thị tất cả đơn hàng
            </p>
          )}
        </div>
      )}
    </div>
  );
};

