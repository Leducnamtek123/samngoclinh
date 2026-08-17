'use client';

import { QrCode, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useEffect, useSyncExternalStore } from 'react';
// @ts-expect-error react-dom type declaration
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Button, ConfirmModal } from '@/components';
import { useCancelOrder } from '@/hooks/queries/useOrderDetail';
import { formatLocalDateTime } from '@/utils/datetime';
import { formatVNDPrice } from '@/utils/formatters';
import { getOrderStatusInfo } from '@/utils/orderStatus';

const emptySubscribe = () => () => {};

export type OrderDetailItem = {
  id?: string;
  productId?: string;
  name: string;
  quantity: number;
  price?: number;
  treePrice?: number;
  careFee?: number;
  protectionFee?: number;
  vatProduct?: number;
  vatCare?: number;
  vatProtection?: number;
  shippingFee?: number;
  imageUrl?: string;
  image?: string;
  images?: string[];
};

export type OrderDetailData = {
  id?: string;
  code: string;
  createdAt: string;
  status: 'PAID' | 'PENDING' | 'CANCELLED' | string;
  totalAmount?: number;
  total?: number;
  subtotal?: number;
  vatAmount?: number;
  shippingFee?: number;
  user?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  items?: OrderDetailItem[];
  shippingMethod?: string;
  paymentMethod?: string;
};

type OrderDetailModalProps = {
  order: OrderDetailData | null;
  onClose: () => void;
  onRefreshOrders?: () => void;
};

export const OrderDetailModal = ({ order, onClose, onRefreshOrders }: OrderDetailModalProps) => {
  const t = useTranslations('orderDetailModal');

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const cancelOrderMutation = useCancelOrder();

  useEffect(() => {
    if (!order) {
      return;
    }
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, [order]);

  if (!order || !mounted || typeof document === 'undefined') {
    return null;
  }

  const orderCode = order.code.startsWith('#') ? order.code : `#${order.code}`;
  const rawCode = order.code.replace('#', '');
  const statusLower = (order.status || '').toLowerCase();
  const canPayOrCancel = statusLower === 'pending';

  const userFullName = order.user?.fullName ?? '—';
  const userEmail = order.user?.email ?? '—';
  const userPhone = order.user?.phone ?? '—';

  const items = Array.isArray(order.items) ? order.items : [];
  const rawTotal = order.totalAmount ?? order.total;
  const finalTotal = rawTotal == null ? null : Number(rawTotal);
  const itemsSubtotal = items.reduce(
    (sum, item) => sum + Number(item.price || item.treePrice || 0) * Number(item.quantity || 1),
    0,
  );
  const subtotalVal =
    order.subtotal == null
      ? itemsSubtotal > 0
        ? itemsSubtotal
        : finalTotal
      : Number(order.subtotal);
  const shippingFeeVal = Number(order.shippingFee || 0);
  const vatVal =
    order.vatAmount == null
      ? finalTotal != null && subtotalVal != null
        ? Math.max(0, finalTotal - subtotalVal - shippingFeeVal)
        : 0
      : Number(order.vatAmount);
  const safeSubtotal = subtotalVal ?? 0;
  const vatPercent = vatVal > 0 && safeSubtotal > 0 ? Math.round((vatVal / safeSubtotal) * 100) : 0;

  const handleConfirmCancelOrder = async () => {
    const orderIdToCancel = order.id || rawCode;
    try {
      await cancelOrderMutation.mutateAsync(orderIdToCancel);
      toast.success(t('cancelSuccess'));
      setIsCancelConfirmOpen(false);
      if (onRefreshOrders) {
        onRefreshOrders();
      }
      onClose();
    } catch {
      toast.error(t('cancelError'));
    }
  };

  const handlePayOrder = () => {
    onClose();
    window.location.href = `/api/proxy/public/payment/sepay/pay/${rawCode}`;
  };

  const modalContent = (
    <>
      <div
        data-lenis-prevent
        className="animate-in fade-in fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-xs transition-opacity duration-200 sm:p-4"
      >
        <div
          data-lenis-prevent
          className="animate-in zoom-in-95 flex max-h-[88vh] w-full max-w-4xl shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card bg-white text-card-foreground shadow-xl transition-transform duration-150 dark:bg-slate-900"
        >
          {/* Top Header Navigation Bar */}
          <div className="z-10 flex flex-shrink-0 items-center justify-between border-b border-border bg-card bg-white px-6 py-4 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-emerald-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>{t('back')}</span>
              </button>
              <h2 className="font-display-lg text-lg font-extrabold text-gray-900 sm:text-xl">
                {t('title')} {orderCode}
              </h2>
            </div>

            {/* Quick Action Buttons Header */}
            {canPayOrCancel && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handlePayOrder}
                  className="h-8 gap-1.5 bg-emerald-600 px-3.5 text-xs font-extrabold text-white hover:bg-emerald-700"
                >
                  <QrCode className="h-4 w-4" />
                  <span>{t('payBtn')}</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  isLoading={cancelOrderMutation.isPending}
                  onClick={() => {
                    setIsCancelConfirmOpen(true);
                  }}
                  className="shrink-0 cursor-pointer border-red-200 bg-red-50/40 text-xs font-bold text-red-700 hover:bg-red-100/60 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400"
                >
                  {!cancelOrderMutation.isPending && <XCircle className="h-3.5 w-3.5" />}
                  <span>{t('cancelOrderBtn')}</span>
                </Button>
              </div>
            )}
          </div>

          {/* Scrollable Modal Content Body */}
          <div
            data-lenis-prevent
            className="modal-content flex-1 space-y-6 p-6 text-gray-800 sm:p-8"
          >
            {/* Order Header Summary Banner */}
            <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2 text-lg font-black text-gray-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>{orderCode}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-gray-400">
                  {formatLocalDateTime(order.createdAt)}
                </p>
              </div>

              {(() => {
                const info = getOrderStatusInfo(order.status);
                return (
                  <span
                    className={`rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase ${info.solidClass || 'bg-emerald-600 text-white'}`}
                  >
                    {info.label}
                  </span>
                );
              })()}
            </div>

            {/* Grid Layout: 2 Columns */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column: Customer & Delivery & Payment info */}
              <div className="space-y-6 lg:col-span-5">
                {/* Customer Info Card */}
                <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                  <h3 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-base font-extrabold text-gray-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-500"
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
                    <span>{t('customerInfo')}</span>
                  </h3>
                  <div className="space-y-1 text-xs">
                    <p className="font-medium text-gray-500">{userEmail}</p>
                    <p className="text-sm font-bold text-gray-900">{userFullName}</p>
                    <p className="font-medium text-gray-600">{userPhone}</p>
                  </div>

                  <div className="space-y-2 border-t border-gray-100 pt-3">
                    <h4 className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
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
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                      <span>{t('shippingInfo')}</span>
                    </h4>
                    <div className="rounded-xl border border-gray-200/50 bg-gray-100/70 p-3 text-xs font-semibold text-gray-700">
                      {order.shippingMethod || t('homeDelivery')}
                    </div>
                  </div>
                </div>

                {/* Payment Method Card */}
                <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                  <h3 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-base font-extrabold text-gray-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span>{t('paymentMethod')}</span>
                  </h3>
                  <div className="flex items-center justify-between rounded-xl border border-emerald-500 bg-emerald-50/20 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          {order.paymentMethod || t('onlinePayment')}
                        </p>
                        <p className="text-[10px] font-medium text-gray-500">
                          {t('selectedMethod')}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white uppercase">
                      {t('selectedBadge')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Ordered Products & Cost Breakdown */}
              <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs lg:col-span-7">
                <h3 className="border-b border-gray-100 pb-3 text-base font-extrabold text-gray-900">
                  {t('orderedProducts')}
                </h3>

                {/* Items Card List */}
                <div className="space-y-4">
                  {items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-xs text-gray-400">
                      {t('noProducts')}
                    </div>
                  ) : (
                    items.map((item) => {
                      const itemPrice = Number(item.price) || 0;
                      const itemQty = Number(item.quantity) || 1;
                      const rawImg =
                        item.imageUrl ||
                        item.image ||
                        (Array.isArray(item.images) ? item.images[0] : null);
                      const initialImg =
                        rawImg && typeof rawImg === 'string' && rawImg.trim() !== ''
                          ? rawImg
                          : '/images/kon_tum_ginseng.png';

                      return (
                        <div
                          key={item.id || item.productId || item.name}
                          className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                        >
                          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                            <Image
                              src={initialImg}
                              alt={item.name || 'Product'}
                              fill
                              sizes="64px"
                              unoptimized
                              className="rounded-lg object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <h4 className="truncate text-sm font-bold text-gray-900">
                              {item.name || 'Product'}
                            </h4>
                            <p className="text-xs font-medium text-gray-500">
                              {t('quantity')}: {itemQty}
                            </p>
                            <div className="flex flex-wrap gap-x-3 pt-0.5 text-[11px] font-medium text-gray-600">
                              <span>
                                {t('unitPrice')}: <strong>{formatVNDPrice(itemPrice)}</strong>
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-extrabold text-gray-900">
                              {formatVNDPrice(itemPrice * itemQty)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Detailed Cost Breakdown Table */}
                <div className="space-y-2 border-t border-gray-100 pt-4 text-xs font-medium text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>{t('subtotal')}</span>
                    <span className="font-bold text-gray-800">
                      {subtotalVal == null ? '—' : formatVNDPrice(subtotalVal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('shippingFee')}</span>
                    <span className="font-bold text-emerald-700">
                      {shippingFeeVal > 0 ? formatVNDPrice(shippingFeeVal) : t('free')}
                    </span>
                  </div>
                  {vatVal > 0 && (
                    <div className="flex items-center justify-between font-semibold text-amber-800">
                      <span>
                        {t('vatTax')}
                        {vatPercent > 0 ? ` (${vatPercent}%)` : ''}
                      </span>
                      <span>+{formatVNDPrice(vatVal)}</span>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 text-sm font-black text-gray-900">
                    <span>{t('total')}</span>
                    <span className="text-lg text-emerald-800">
                      {finalTotal == null ? '—' : formatVNDPrice(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Design System Confirm Modal for Order Cancellation */}
      <ConfirmModal
        isOpen={isCancelConfirmOpen}
        title={t('cancelTitle')}
        description={t('cancelDescription', { code: orderCode })}
        cancelText={t('keepOrder')}
        confirmText={t('cancelOrderBtn')}
        isDestructive={true}
        isLoading={cancelOrderMutation.isPending}
        onConfirm={handleConfirmCancelOrder}
        onCancel={() => {
          setIsCancelConfirmOpen(false);
        }}
      />
    </>
  );

  return createPortal(modalContent, document.body);
};
