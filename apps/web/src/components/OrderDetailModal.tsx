'use client';

import { useSyncExternalStore } from 'react';
import Image from 'next/image';
// @ts-expect-error react-dom type declaration
import { createPortal } from 'react-dom';

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
};

export const OrderDetailModal = ({ order, onClose }: OrderDetailModalProps) => {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!order || !mounted || typeof document === 'undefined') return null;

  const orderCode = order.code.startsWith('#') ? order.code : `#${order.code}`;
  const isPaid = order.status === 'PAID';

  const userFullName = order.user?.fullName || 'Lê Thạch';
  const userEmail = order.user?.email || 'hoangquan.286@gmail.com';
  const userPhone = order.user?.phone || '0909004740';

  const items = Array.isArray(order.items) && order.items.length > 0 
    ? order.items 
    : [
        {
          name: 'Cây Sâm Ngọc Linh 2026',
          quantity: 1,
          price: 159343,
          treePrice: 86834,
          careFee: 50800,
          protectionFee: 21709,
          imageUrl: '/assets/images/kon_tum_ginseng.png'
        }
      ];

  const firstItem: Partial<OrderDetailItem> = items[0] || {};
  const itemPrice = firstItem.price || order.totalAmount || 0;
  const treePrice = firstItem.treePrice || Math.round(itemPrice * 0.5);
  const careFee = firstItem.careFee || Math.round(itemPrice * 0.3);
  const protectionFee = firstItem.protectionFee || Math.round(itemPrice * 0.13);
  
  const vatProduct = Math.round(treePrice * 0.05);
  const vatCare = Math.round(careFee * 0.1);
  const vatProtection = Math.round(protectionFee * 0.1);
  const shippingFee = 0;

  const computedTotal = treePrice + vatProduct + careFee + vatCare + protectionFee + vatProtection + shippingFee;
  const finalTotal = order.totalAmount > 0 ? order.totalAmount : computedTotal;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 transition-opacity duration-200 animate-in fade-in">
      <div className="bg-gray-50 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-gray-200 my-8 transition-[opacity,transform] duration-150 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Top Header Navigation Bar */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center gap-4 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#EAB308] hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
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

        {/* Scrollable Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-gray-800">
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

            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isPaid ? 'bg-[#10B981] text-white' : 'bg-amber-500 text-white'
            }`}>
              {isPaid ? 'Đã thanh toán' : 'Chờ thanh toán'}
            </span>
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
                    {order.shippingMethod || 'Nhận trực tiếp tại vườn'}
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
                  <span className="bg-[#10B981] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
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
                        <span>Giá cây: <strong>{treePrice.toLocaleString('vi-VN')} đ</strong></span>
                        <span>Phí đã chọn: <strong>{(careFee + protectionFee).toLocaleString('vi-VN')} đ</strong></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block font-medium">Trước VAT</span>
                      <span className="font-extrabold text-gray-900 text-sm">
                        {(treePrice + careFee + protectionFee).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Cost Breakdown Table */}
              <div className="border-t border-gray-100 pt-4 space-y-2 text-xs font-medium text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Giá cây</span>
                  <span className="font-bold text-gray-800">{treePrice.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-400">
                  <span>VAT sản phẩm (5%)</span>
                  <span>{vatProduct.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phí chăm sóc</span>
                  <span className="font-bold text-gray-800">{careFee.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-400">
                  <span>VAT chăm sóc (10%)</span>
                  <span>{vatCare.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phí bảo vệ cây</span>
                  <span className="font-bold text-gray-800">{protectionFee.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-400">
                  <span>VAT bảo vệ (10%)</span>
                  <span>{vatProtection.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phí vận chuyển</span>
                  <span className="font-bold text-gray-800">{shippingFee.toLocaleString('vi-VN')} đ</span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center text-sm font-black text-gray-900">
                  <span>Tổng cộng:</span>
                  <span className="text-lg text-[#1C3F24]">{finalTotal.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
