'use client';

import React, { useState, useEffect } from 'react';

export interface SepayPaymentInfo {
  qrUrl: string;
  accountNumber: string;
  accountName: string;
  bankBrand: string;
  amount: number;
  orderCode: string;
}

interface SepayPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentInfo: SepayPaymentInfo;
  onPaymentSuccess?: () => void;
  checkStatusApiUrl?: string;
}

export const SepayPaymentModal: React.FC<SepayPaymentModalProps> = ({
  isOpen,
  onClose,
  paymentInfo,
  onPaymentSuccess,
  checkStatusApiUrl,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(true);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // Poll order status
  useEffect(() => {
    if (!isOpen || !checkStatusApiUrl || isPaid || !isPolling) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(checkStatusApiUrl);
        if (res.ok) {
          const data = await res.json();
          const status = data?.data?.status;
          if (status === 'paid') {
            setIsPaid(true);
            setIsPolling(false);
            if (onPaymentSuccess) {
              onPaymentSuccess();
            }
          }
        }
      } catch (err) {
        console.error('Failed to poll payment status', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, checkStatusApiUrl, isPaid, isPolling, onPaymentSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight">Thanh Toán Chuyển Khoản QR</h3>
              <p className="text-xs text-gray-500 font-medium">Tự động xác nhận qua SePay VietQR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Payment Success State */}
        {isPaid ? (
          <div className="py-8 text-center space-y-4 animate-scale-up">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-gray-900">Thanh Toán Thành Công!</h4>
              <p className="text-sm text-gray-500">Đơn hàng <span className="font-bold text-emerald-700">{paymentInfo.orderCode}</span> đã được ghi nhận thanh toán.</p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
            >
              Hoàn tất
            </button>
          </div>
        ) : (
          /* Payment QR & Details */
          <div className="space-y-6">
            
            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 space-y-3">
              <div className="relative group p-2 bg-white rounded-xl shadow-md border border-gray-200">
                <img
                  src={paymentInfo.qrUrl}
                  alt={`VietQR Thanh toán SePay - ${paymentInfo.orderCode}`}
                  className="w-56 h-56 object-contain rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Đang chờ chuyển khoản ngân hàng...
              </div>
            </div>

            {/* Transfer Details Card */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-200/80 text-xs sm:text-sm">
              
              {/* Bank Brand */}
              <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Ngân hàng:</span>
                <span className="font-black text-gray-900 uppercase bg-white px-2 py-0.5 rounded border border-gray-200">{paymentInfo.bankBrand}</span>
              </div>

              {/* Account Number */}
              <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Số tài khoản:</span>
                <div className="flex items-center gap-2 font-mono font-bold text-gray-900">
                  <span>{paymentInfo.accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(paymentInfo.accountNumber, 'acc')}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2 py-0.5 rounded transition-colors"
                  >
                    {copiedField === 'acc' ? 'Đã chép!' : 'Chép'}
                  </button>
                </div>
              </div>

              {/* Account Holder Name */}
              <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Chủ tài khoản:</span>
                <span className="font-bold text-gray-900 uppercase">{paymentInfo.accountName}</span>
              </div>

              {/* Transfer Amount */}
              <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Số tiền chuyển:</span>
                <div className="flex items-center gap-2 font-black text-emerald-700 text-base">
                  <span>{formatCurrency(paymentInfo.amount)}</span>
                  <button
                    onClick={() => copyToClipboard(paymentInfo.amount.toString(), 'amount')}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2 py-0.5 rounded transition-colors"
                  >
                    {copiedField === 'amount' ? 'Đã chép!' : 'Chép'}
                  </button>
                </div>
              </div>

              {/* Transfer Content */}
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-500 font-medium">Nội dung CK:</span>
                <div className="flex items-center gap-2 font-mono font-black text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                  <span>{paymentInfo.orderCode}</span>
                  <button
                    onClick={() => copyToClipboard(paymentInfo.orderCode, 'code')}
                    className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium px-2 py-0.5 rounded transition-colors"
                  >
                    {copiedField === 'code' ? 'Đã chép!' : 'Chép'}
                  </button>
                </div>
              </div>

            </div>

            {/* Note */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed font-medium flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>
                <strong>Lưu ý quan trọng:</strong> Vui lòng giữ nguyên <strong>Nội dung CK: {paymentInfo.orderCode}</strong> khi thực hiện chuyển khoản để hệ thống SePay tự động kích hoạt đơn hàng trong vài giây.
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
