'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchApiClient } from '@/lib/ApiClient';
import { useSepayPaymentStatus } from '@/hooks/queries/useSepayPayment';
import { Button } from '@/components';
import { X, Check } from 'lucide-react';

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

const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export const SepayPaymentModal: React.FC<SepayPaymentModalProps> = ({
  isOpen,
  onClose,
  paymentInfo,
  onPaymentSuccess,
  checkStatusApiUrl,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [dynamicInfo, setDynamicInfo] = useState<SepayPaymentInfo>(paymentInfo);

  const { data: statusData } = useSepayPaymentStatus(
    checkStatusApiUrl || (paymentInfo?.orderCode ? `/public/payment/sepay/status/${paymentInfo.orderCode}` : null),
    Boolean(isOpen && !isPaid)
  );

  useEffect(() => {
    if (statusData?.status === 'paid' || statusData?.isPaid) {
      setIsPaid(true);
      if (onPaymentSuccess) onPaymentSuccess();
    }
  }, [statusData, onPaymentSuccess]);

  useEffect(() => {
    if (!isOpen || !paymentInfo?.orderCode) return;
    setDynamicInfo(paymentInfo);
    fetchApiClient(`/public/payment/sepay/verify/${paymentInfo.orderCode}`)
      .then((res) => {
        const data = res?.data || res;
        if (data) {
          setDynamicInfo({
            qrUrl: data.qrUrl || '',
            accountNumber: data.accountNumber || '',
            accountName: data.accountName || '',
            bankBrand: data.bankBrand || '',
            amount: Number(data.total) || paymentInfo.amount || 0,
            orderCode: data.code || paymentInfo.orderCode || '',
          });
        }
      })
      .catch(() => {});
  }, [isOpen, paymentInfo]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatCurrency = (val: number) => {
    return currencyFormatter.format(val);
  };

  useEffect(() => {
    if (!isOpen) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md transition-opacity animate-fade-in">
      <div data-lenis-prevent className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-8 space-y-5 sm:space-y-6">
        
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
              <p className="text-xs text-gray-500 font-medium">Tự động xác nhận qua chuyển khoản ngân hàng</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Payment Success State */}
        {isPaid ? (
          <div className="py-8 text-center space-y-4 animate-scale-up">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-gray-900">Thanh Toán Thành Công!</h4>
              <p className="text-sm text-gray-500">Đơn hàng <span className="font-bold text-emerald-700">{dynamicInfo.orderCode}</span> đã được ghi nhận thanh toán.</p>
            </div>
            <Button
              onClick={onClose}
              size="lg"
              className="mt-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md"
            >
              Hoàn tất
            </Button>
          </div>
        ) : (
          /* Payment QR & Details */
          <div className="space-y-6">
            
            {/* QR Code Container */}
            {dynamicInfo.qrUrl && (
              <div className="flex flex-col items-center justify-center p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
                <div className="relative w-48 h-48 bg-white p-2 rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
                  <Image
                    src={dynamicInfo.qrUrl}
                    alt="VietQR Payment Code"
                    fill
                    sizes="192px"
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <p className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5 pt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Mở ứng dụng Ngân hàng để quét mã VietQR
                </p>
              </div>
            )}

            {/* Transfer Details Form Table */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-3 text-xs">
              
              {/* Bank Brand */}
              {dynamicInfo.bankBrand && (
                <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500 font-medium">Ngân hàng:</span>
                  <span className="font-black text-gray-900 uppercase bg-white px-2 py-0.5 rounded border border-gray-200">{dynamicInfo.bankBrand}</span>
                </div>
              )}

              {/* Account Number */}
              {dynamicInfo.accountNumber && (
                <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500 font-medium">Số tài khoản:</span>
                  <div className="flex items-center gap-2 font-mono font-bold text-gray-900">
                    <span>{dynamicInfo.accountNumber}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyToClipboard(dynamicInfo.accountNumber, 'acc')}
                      className="h-6 text-[11px] px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {copiedField === 'acc' ? 'Đã chép!' : 'Chép'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Account Holder Name */}
              {dynamicInfo.accountName && (
                <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500 font-medium">Chủ tài khoản:</span>
                  <span className="font-bold text-gray-900 uppercase">{dynamicInfo.accountName}</span>
                </div>
              )}

              {/* Transfer Amount */}
              <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Số tiền chuyển:</span>
                <div className="flex items-center gap-2 font-black text-emerald-700 text-base">
                  <span>{formatCurrency(dynamicInfo.amount)}</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyToClipboard(dynamicInfo.amount.toString(), 'amount')}
                    className="h-6 text-[11px] px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {copiedField === 'amount' ? 'Đã chép!' : 'Chép'}
                  </Button>
                </div>
              </div>

              {/* Transfer Content */}
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-500 font-medium">Nội dung CK:</span>
                <div className="flex items-center gap-2 font-mono font-black text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                  <span>{dynamicInfo.orderCode}</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyToClipboard(dynamicInfo.orderCode, 'code')}
                    className="h-6 text-[11px] px-2 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {copiedField === 'code' ? 'Đã chép!' : 'Chép'}
                  </Button>
                </div>
              </div>

            </div>

            {/* Note */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed font-medium flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>
                <strong>Lưu ý quan trọng:</strong> Vui lòng giữ nguyên <strong>Nội dung CK: {dynamicInfo.orderCode}</strong> khi thực hiện chuyển khoản để hệ thống tự động kích hoạt đơn hàng trong vài giây.
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
