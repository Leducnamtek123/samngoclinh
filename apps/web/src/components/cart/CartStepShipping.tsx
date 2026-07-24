import { MapPin, User, Phone, FileText, QrCode, ArrowLeft } from 'lucide-react';
import type { CartItem } from '@/utils/cart';

type CartStepShippingProps = {
  items: CartItem[];
  totalAmount: number;
  recipientName: string;
  setRecipientName: (val: string) => void;
  recipientPhone: string;
  setRecipientPhone: (val: string) => void;
  shippingAddress: string;
  setShippingAddress: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
  loading: boolean;
  t: (key: string) => string;
  onSubmit: (e: React.FormEvent) => void;
  onPrevStep: () => void;
};

export const CartStepShipping = ({
  items,
  totalAmount,
  recipientName,
  setRecipientName,
  recipientPhone,
  setRecipientPhone,
  shippingAddress,
  setShippingAddress,
  notes,
  setNotes,
  loading,
  t,
  onSubmit,
  onPrevStep,
}: CartStepShippingProps) => {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Shipping Form */}
      <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <span>{t('deliveryAddress')}</span>
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label htmlFor="recipientName" className="font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-500" />
              <span>{t('recipientName')} *</span>
            </label>
            <input
              id="recipientName"
              type="text"
              required
              placeholder={t('recipientName')}
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 focus:outline-none font-semibold text-gray-800"
            />
          </div>

          <div>
            <label htmlFor="recipientPhone" className="font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              <span>{t('phoneNumber')} *</span>
            </label>
            <input
              id="recipientPhone"
              type="tel"
              required
              placeholder={t('phoneNumber')}
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 focus:outline-none font-semibold text-gray-800"
            />
          </div>

          <div>
            <label htmlFor="shippingAddress" className="font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
              <span>{t('deliveryAddress')} *</span>
            </label>
            <input
              id="shippingAddress"
              type="text"
              required
              placeholder={t('deliveryAddress')}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 focus:outline-none font-semibold text-gray-800"
            />
          </div>

          <div>
            <label htmlFor="orderNotes" className="font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-500" />
              <span>Ghi chú đơn hàng</span>
            </label>
            <textarea
              id="orderNotes"
              rows={3}
              placeholder="Giao giờ hành chính, gọi trước khi giao..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 focus:outline-none font-medium text-gray-800 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Order Confirmation Summary */}
      <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="font-extrabold text-gray-900 text-base border-b border-gray-100 pb-3">Xác nhận đơn hàng</h3>

        <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
          {items.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-gray-800 line-clamp-1">{item.name}</p>
                <p className="text-[10px] text-gray-400 font-semibold">{item.quantity} x {item.price.toLocaleString('vi-VN')} đ</p>
              </div>
              <span className="font-bold text-emerald-800">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
          <div className="flex justify-between font-semibold text-gray-600">
            <span>Tạm tính</span>
            <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-600">
            <span>Phí vận chuyển</span>
            <span className="text-emerald-700 font-bold">Miễn phí</span>
          </div>
          <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-100">
            <span>Tổng thanh toán</span>
            <span className="text-emerald-800">{totalAmount.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Đang tạo đơn hàng...</span>
            ) : (
              <>
                <QrCode className="w-4 h-4" />
                <span>Xác Nhận & Thanh Toán VietQR</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onPrevStep}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Giỏ hàng</span>
          </button>
        </div>
      </div>
    </form>
  );
};
