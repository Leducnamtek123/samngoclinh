'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import Image from 'next/image';

// @ts-expect-error react-dom type declaration
import { createPortal } from 'react-dom';
import { QrCode, XCircle } from 'lucide-react';
import { useCancelOrder } from '@/hooks/queries/useOrderDetail';
import { toast } from 'sonner';
import { Button, ConfirmModal } from '@/components';
import { getOrderStatusInfo } from '@/components/profile/ProfileOrdersTab';

const emptySubscribe = () => () => {};

export type OrderDetailItem = {
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
};

export type OrderDetailData = {
  id?: string;
  code: string;
  createdAt: string;
  status: 'PAID' | 'PENDING' | 'CANCELLED' | string;
  totalAmount: number;
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
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const cancelOrderMutation = useCancelOrder();

  useEffect(() => {
    if (!order) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, [order]);

  if (!order || !mounted || typeof document === 'undefined') return null;

  const orderCode = order.code.startsWith('#') ? order.code : `#${order.code}`;
  const rawCode = order.code.replace('#', '');
  const isPaid = order.status === 'PAID' || order.status === 'completed';
  const isCancelled = order.status === 'CANCELLED' || order.status === 'cancelled';

  const userFullName = order.user?.fullName || 'Nhà đầu tư';
  const userEmail = order.user?.email || 'N/A';
  const userPhone = order.user?.phone || 'N/A';

  const items = Array.isArray(order.items) && order.items.length > 0 
    ? order.items 
    : [
        {
          name: 'Cây Sâm Ngọc Linh',
          quantity: 1,
          price: order.totalAmount || 180000,
          treePrice: Math.round((order.totalAmount || 180000) * 0.6),
          careFee: Math.round((order.totalAmount || 180000) * 0.4),
          protectionFee: 0,
          imageUrl: '/assets/images/kon_tum_ginseng.png'
        }
      ];

  const firstItem: Partial<OrderDetailItem> = items[0] || {};
  const itemPrice = firstItem.price || order.totalAmount || 0;
  const treePrice = firstItem.treePrice || Math.round(itemPrice * 0.6);
  const careFee = firstItem.careFee || Math.round(itemPrice * 0.4);
  const protectionFee = firstItem.protectionFee || 0;
  
  const vatProduct = Math.round(treePrice * 0.05);
  const vatCare = Math.round(careFee * 0.1);
  const vatProtection = Math.round(protectionFee * 0.1);
  const shippingFee = 0;

  const computedTotal = treePrice + vatProduct + careFee + vatCare + protectionFee + vatProtection + shippingFee;
  const finalTotal = order.totalAmount > 0 ? order.totalAmount : computedTotal;

  const handleConfirmCancelOrder = async () => {
    const orderIdToCancel = order.id || rawCode;
    try {
      await cancelOrderMutation.mutateAsync(orderIdToCancel);
      toast.success(`Đã hủy đơn hàng ${orderCode} thành công!`);
      setIsCancelConfirmOpen(false);
      if (onRefreshOrders) onRefreshOrders();
      onClose();
    } catch {
      toast.error('Không thể hủy đơn hàng này. Vui lòng thử lại.');
    }
  };

  const handlePayOrder = () => {
    onClose();
    window.location.href = `/api/proxy/public/payment/sepay/pay/${rawCode}`;
  };

  const modalContent = (
    <>
      <div data-lenis-prevent className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 transition-opacity duration-200 animate-in fade-in">
        <div data-lenis-prevent className="bg-gray-50 rounded-[20px] w-full max-w-4xl shadow-2xl overflow-hidden border border-gray-200 transition-[opacity,transform] duration-150 animate-in zoom-in-95 max-h-[min(88vh,820px)] flex flex-col my-auto">
          {/* Top Header Navigation Bar */}
          <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0 z-10 rounded-t-[20px] shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Quay lại</span>
              </button>
              <h2 className="font-extrabold text-gray-900 text-lg sm:text-xl font-display-lg">
                Chi tiết đơn hàng {orderCode}
              </h2>
            </div>

            {/* Quick Action Buttons Header */}
            {!isPaid && !isCancelled && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handlePayOrder}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-8 px-3.5 gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Thanh toán</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  isLoading={cancelOrderMutation.isPending}
                  onClick={() => setIsCancelConfirmOpen(true)}
                  className="border-red-200 bg-red-50/40 hover:bg-red-100/60 text-red-700 dark:text-red-400 dark:border-red-800 dark:bg-red-950/40 text-xs font-bold shrink-0 cursor-pointer"
                >
                  {!cancelOrderMutation.isPending && <XCircle className="w-3.5 h-3.5" />}
                  <span>Hủy Đơn</span>
                </Button>
              </div>
            )}
          </div>

          {/* Scrollable Modal Content Body */}
          <div data-lenis-prevent className="p-6 sm:p-8 space-y-6 modal-content flex-1 text-gray-800">
            {/* Order Header Summary Banner */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2 font-black text-gray-900 text-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>{orderCode}</span>
                </div>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  {order.createdAt}
                </p>
              </div>

              {(() => {
                const info = getOrderStatusInfo(order.status);
                return (
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${info.solidClass || 'bg-emerald-600 text-white'}`}>
                    {info.label}
                  </span>
                );
              })()}
            </div>

            {/* Grid Layout: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Customer & Delivery & Payment info */}
              <div className="lg:col-span-5 space-y-6">
                {/* Customer Info Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-gray-900 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Thông tin khách hàng</span>
                  </h3>
                  <div className="space-y-1 text-xs">
                    <p className="text-gray-500 font-medium">{userEmail}</p>
                    <p className="font-bold text-gray-900 text-sm">{userFullName}</p>
                    <p className="text-gray-600 font-medium">{userPhone}</p>
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <h4 className="font-bold text-gray-700 text-xs flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <span>Thông tin giao hàng</span>
                    </h4>
                    <div className="bg-gray-100/70 border border-gray-200/50 rounded-xl p-3 text-xs font-semibold text-gray-700">
                      {order.shippingMethod || 'Giao hàng tận nơi'}
                    </div>
                  </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-gray-900 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Phương thức thanh toán</span>
                  </h3>
                  <div className="border border-emerald-500 bg-emerald-50/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-xs">{order.paymentMethod || 'Thanh toán trực tuyến'}</p>
                        <p className="text-[10px] text-gray-500 font-medium">Phương thức đã chọn</p>
                      </div>
                    </div>
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      Đã chọn
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Ordered Products & Cost Breakdown */}
              <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-6">
                <h3 className="font-extrabold text-gray-900 text-base border-b border-gray-100 pb-3">
                  Sản phẩm đã đặt
                </h3>

                {/* Items Card List */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.name} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex gap-4 items-center">
                      <div className="relative w-16 h-16 shrink-0">
                        <Image
                          src={item.imageUrl || '/assets/images/kon_tum_ginseng.png'}
                          alt={item.name}
                          fill
                          sizes="64px"
                          unoptimized
                          className="object-cover rounded-lg border border-gray-200 bg-white"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 font-medium">Số lượng: {item.quantity}</p>
                        <div className="flex flex-wrap gap-x-3 text-[11px] text-gray-600 font-medium pt-0.5">
                          <span>Đơn giá: <strong>{(item.price || treePrice).toLocaleString('vi-VN')} đ</strong></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-gray-900 text-sm">
                          {((item.price || treePrice) * item.quantity).toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed Cost Breakdown Table */}
                <div className="border-t border-gray-100 pt-4 space-y-2 text-xs font-medium text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Tạm tính</span>
                    <span className="font-bold text-gray-800">{finalTotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Phí vận chuyển</span>
                    <span className="font-bold text-emerald-700">Miễn phí</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center text-sm font-black text-gray-900">
                    <span>Tổng cộng:</span>
                    <span className="text-lg text-emerald-800">{finalTotal.toLocaleString('vi-VN')} đ</span>
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
        title="Hủy đơn hàng?"
        description={`Bạn có chắc chắn muốn hủy đơn hàng ${orderCode}?\nHành động này không thể hoàn tác.`}
        cancelText="Không, giữ đơn"
        confirmText="Hủy đơn hàng"
        isDestructive={true}
        isLoading={cancelOrderMutation.isPending}
        onConfirm={handleConfirmCancelOrder}
        onCancel={() => setIsCancelConfirmOpen(false)}
      />
    </>
  );

  return createPortal(modalContent, document.body);
};
