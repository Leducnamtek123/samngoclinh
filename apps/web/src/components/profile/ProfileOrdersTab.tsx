'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/I18nNavigation';
import { Button, Badge } from '@/components/ui';
import { EmptyState, LoadingState, ErrorState } from '@/components/common';
import { ShoppingBag } from 'lucide-react';
import { formatVNDPrice } from '@/utils/formatters';
import { formatLocalDateTime } from '@/utils/datetime';
import { getOrderStatusInfo } from '@/utils/orderStatus';
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
  const t = useTranslations('ordersTab');
  const tCommon = useTranslations('actions');
  const tStatus = useTranslations('status');

  const tabs = [
    { id: 'all', label: t('all'), count: statusCounts.all },
    { id: 'pending', label: t('pending'), count: statusFilter === 'pending' ? Math.max(statusCounts.pending || 0, safeOrders.length) : statusCounts.pending },
    { id: 'paid', label: tStatus('paid'), count: statusFilter === 'paid' ? Math.max(statusCounts.paid || 0, safeOrders.length) : statusCounts.paid },
    { id: 'shipping', label: t('shipping'), count: statusFilter === 'shipping' ? Math.max(statusCounts.shipping || 0, safeOrders.length) : statusCounts.shipping },
    { id: 'completed', label: t('completed'), count: statusFilter === 'completed' ? Math.max(statusCounts.completed || 0, safeOrders.length) : statusCounts.completed },
    { id: 'cancelled', label: t('cancelled'), count: statusFilter === 'cancelled' ? Math.max(statusCounts.cancelled || 0, safeOrders.length) : statusCounts.cancelled },
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
        <h3 className="text-lg font-bold text-gray-900">{t('orderCode', { code: '' }).replace('#', '').trim()}</h3>
        <p className="text-xs text-gray-400 font-medium">{t('noOrders')}</p>
      </div>

      {/* Filter Tabs Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-200 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          const showBadge = tab.id !== 'all' && (tab.count ?? 0) > 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusFilterChange(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-[color,background-color,box-shadow] flex items-center gap-1.5 cursor-pointer ${
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
        <LoadingState variant="centered" message={tCommon('loading')} />
      ) : ordersError ? (
        <ErrorState
          title={tCommon('error')}
          message={ordersError}
          onRetry={onRetry}
        />
      ) : safeOrders.length === 0 ? (
        <EmptyState
          title={t('noOrders')}
          description={t('noOrders')}
          icon={ShoppingBag}
        >
          <Button asChild variant="default" className="mt-2">
            <Link href="/products">{t('reorder')}</Link>
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
                      <span className="font-bold text-gray-900 text-sm">
                        {t('orderCode', { code: ord.code || ord.id || '' })}
                      </span>
                      <span className="text-xs text-gray-400 block mt-0.5">
                        {t('placedAt', { date: formatLocalDateTime(ord.createdAt) })}
                      </span>
                    </div>
                    <Badge variant="secondary" className={statusInfo.badgeClass}>
                      {statusInfo.label}
                    </Badge>
                  </div>

                  {safeItems.length > 0 && safeItems.map((item: any, idx: number) => (
                    <div key={item.id || item.productId || item.name || idx} className="flex justify-between items-center text-xs font-medium text-gray-700">
                      <span>{item.name || 'Product'} (x{item.quantity ?? 1})</span>
                      <span>{item.price != null ? formatVNDPrice(Number(item.price) * Number(item.quantity ?? 1)) : '—'}</span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-900">
                      {t('totalAmount')} <strong className="text-emerald-800 text-sm font-black">{finalTotal != null ? formatVNDPrice(finalTotal) : '—'}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewDetail(ord)}
                      >
                        {t('viewDetails')}
                      </Button>
                      {statusInfo.canPay && (
                        <Button
                          type="button"
                          variant="emerald"
                          size="sm"
                          onClick={() => onPayOrder(ord)}
                        >
                          {tCommon('checkout')}
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
                  <span>{tCommon('loading')}</span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLoadMore}
                  className="text-xs font-bold text-emerald-800 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100"
                >
                  {tCommon('viewAll')}
                </Button>
              )}
            </div>
          )}

          {!hasMore && safeOrders.length > 0 && (
            <p className="text-center text-xs text-gray-400 font-medium py-3 border-t border-gray-100">
              —
            </p>
          )}
        </div>
      )}
    </div>
  );
};
