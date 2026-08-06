'use client';

import { useState, useSyncExternalStore } from 'react';
// @ts-expect-error react-dom type declaration
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { 
  X, 
  Minus, 
  Plus, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  CreditCard, 
  ShieldCheck, 
  Gift, 
  ExternalLink,
  Loader2
} from 'lucide-react';

const emptySubscribe = () => () => {};

export type ClaimPlantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
};

export function ClaimPlantModal({ isOpen, onClose, item }: ClaimPlantModalProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const [quantity, setQuantity] = useState(1);
  const [careYears, setCareYears] = useState(1);
  const [protectionYears, setProtectionYears] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [openContract, setOpenContract] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !mounted) return null;

  // Base costs per unit for 1 year
  const careCostPerYear = 50800;
  const protectionCostPerYear = 23007;
  const plantValue = 92026;

  // Total cost calculations
  const totalCareFee = careCostPerYear * careYears * quantity;
  const vatCare = Math.round(totalCareFee * 0.1);
  const totalProtectionFee = protectionCostPerYear * protectionYears * quantity;
  const vatProtection = Math.round(totalProtectionFee * 0.1);

  const grandTotal = totalCareFee + vatCare + totalProtectionFee + vatProtection;

  const formatVND = (num: number) => {
    return num.toLocaleString('vi-VN') + ' đ';
  };

  const handleClaimSubmit = async () => {
    if (!agreed) return;
    setIsSubmitting(true);
    try {
      // Simulate claim order creation / payment initiation
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsSuccess(true);
    } catch (error) {
      console.error('Claim plant error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const plantName = item?.plantCatalog?.name || 'Cây Sâm Ngọc Linh 2026';
  const imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8";

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in overflow-y-auto">
      <dialog
        open
        className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 transform transition-all duration-200 animate-in zoom-in-95 my-auto block max-h-[90vh] overflow-y-auto"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-100">
          <div className="space-y-1 pr-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Nhận cây sâm 1 năm
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Ưu đãi tặng giá trị cây sâm 1 năm. Bạn chỉ cần chọn đủ gói chăm sóc và bảo vệ cây để nhận ưu đãi.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900">Đăng Ký Nhận Cây Thành Công!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Đơn nhận cây sâm 1 năm đã được khởi tạo thành công trên hệ thống. Cây sâm đã được ghi nhận trực tiếp vào tài khoản của bạn tại vườn Kon Tum.
              </p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 bg-[#1C3F24] hover:bg-[#15301B] text-white font-bold text-sm rounded-2xl shadow-lg transition-colors"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 space-y-6">
            {/* Product Summary Card */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                <Image
                  src={imageUrl}
                  alt={plantName}
                  fill
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <h4 className="font-extrabold text-slate-900 text-base leading-snug">{plantName}</h4>
                <p className="text-xs text-slate-500 font-medium">Tồn kho: {item?.remainingSlots || 168}</p>
                <div className="inline-block bg-emerald-100/80 text-emerald-800 border border-emerald-200/60 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                  Giá cây được tặng
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-800">Số lượng</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-1 text-sm font-extrabold text-slate-900 border-x border-slate-200">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Package Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Care package select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gói chăm sóc</span>
                </label>
                <select
                  value={careYears}
                  onChange={(e) => setCareYears(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                >
                  <option value={1}>1 năm - {formatVND(careCostPerYear * quantity)}</option>
                  <option value={2}>2 năm - {formatVND(careCostPerYear * 2 * quantity)}</option>
                  <option value={3}>3 năm - {formatVND(careCostPerYear * 3 * quantity)}</option>
                </select>
              </div>

              {/* Protection package select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Gói đảm bảo</span>
                </label>
                <select
                  value={protectionYears}
                  onChange={(e) => setProtectionYears(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                >
                  <option value={1}>1 năm - {formatVND(protectionCostPerYear * quantity)}</option>
                  <option value={2}>2 năm - {formatVND(protectionCostPerYear * 2 * quantity)}</option>
                  <option value={3}>3 năm - {formatVND(protectionCostPerYear * 3 * quantity)}</option>
                </select>
              </div>
            </div>

            {/* Detailed Price Breakdown Table */}
            <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>VAT cây (5%):</span>
                <span className="font-semibold text-slate-800">0 đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí chăm sóc:</span>
                <span className="font-semibold text-slate-800">{formatVND(totalCareFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT chăm sóc (10%):</span>
                <span className="font-semibold text-slate-800">{formatVND(vatCare)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí bảo vệ cây:</span>
                <span className="font-semibold text-slate-800">{formatVND(totalProtectionFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT bảo vệ (10%):</span>
                <span className="font-semibold text-slate-800">{formatVND(vatProtection)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-sm sm:text-base font-extrabold text-slate-900">
                <span>Tổng cộng:</span>
                <span className="text-emerald-700 text-lg sm:text-xl font-black">{formatVND(grandTotal)}</span>
              </div>
            </div>

            {/* Offer Discount Card (Green) */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-2 text-xs">
              <span className="font-extrabold text-emerald-900 text-xs sm:text-sm block">
                Ưu đãi tặng cây sâm 1 năm
              </span>
              <div className="flex justify-between text-slate-700">
                <span>Giá cây</span>
                <span className="font-bold">{formatVND(plantValue * quantity)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold">
                <span>Giảm giá cây</span>
                <span>-{formatVND(plantValue * quantity)}</span>
              </div>
            </div>

            {/* Delivery Note Box (Blue) */}
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 space-y-1.5 text-xs text-blue-900">
              <span className="font-bold block text-blue-950">Hình thức nhận cây</span>
              <p className="text-blue-800/90 leading-relaxed font-normal">
                Cây được ghi nhận trực tiếp tại vườn sau khi thanh toán thành công. Bạn không cần nhập địa chỉ giao hàng cho đơn cây trồng.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-slate-600" />
                <span>Phương thức thanh toán</span>
              </span>
              <div className="bg-emerald-50/30 border-2 border-emerald-600 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-4 border-emerald-600 bg-white" />
                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Thanh toán trực tuyến (VietQR)</span>
                </span>
              </div>
            </div>

            {/* Terms & Legal Contract Accordion Box */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-700 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-snug">
                  Tôi đã đọc và đồng ý với điều khoản sử dụng và hợp đồng mua bán, ký gửi, chăm sóc cây Sâm Ngọc Linh.
                </span>
              </label>

              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                {/* Accordion 1: Terms of use */}
                <div className="border border-slate-200/70 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenTerms(!openTerms)}
                    className="w-full px-4 py-2.5 text-xs font-bold text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span>Điều khoản sử dụng</span>
                    {openTerms ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openTerms && (
                    <div className="px-4 pb-3 text-xs text-slate-600 border-t border-slate-100 pt-2 leading-relaxed animate-in fade-in">
                      Điều khoản sử dụng áp dụng cho tất cả tài khoản đăng ký nhận cây ưu đãi và sử dụng dịch vụ chăm sóc tại vườn Sâm Ngọc Linh Kon Tum.
                    </div>
                  )}
                </div>

                {/* Accordion 2: Contract link */}
                <div className="border border-slate-200/70 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenContract(!openContract)}
                    className="w-full px-4 py-2.5 text-xs font-bold text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span>Hợp đồng mua bán cây</span>
                    {openContract ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openContract && (
                    <div className="px-4 pb-3.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5 space-y-2 animate-in fade-in">
                      <p className="leading-relaxed">
                        Hợp đồng mua bán, ký gửi và chăm sóc cây Sâm Ngọc Linh áp dụng cho đơn hàng cây trồng và các dịch vụ đi kèm.
                      </p>
                      <div>
                        <a
                          href="/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold underline transition-colors"
                        >
                          <span>Mở hợp đồng mua bán, ký gửi và chăm sóc cây Sâm Ngọc Linh</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={!agreed || isSubmitting}
                onClick={handleClaimSubmit}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:hover:bg-emerald-600 disabled:shadow-none flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Nhận cây</span>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>,
    document.body
  );
}
