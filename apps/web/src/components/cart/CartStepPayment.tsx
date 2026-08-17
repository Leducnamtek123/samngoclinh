'use client';

import { QrCode, RefreshCw, Check, Copy, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { formatVNDPrice } from '@/utils/formatters';

export type OrderInfo = {
  orderId: string;
  orderCode: string;
  amount: number;
  qrUrl: string;
  accountNo: string;
  accountName: string;
  bankName: string;
};

export type CartStepPaymentProps = {
  orderInfo: OrderInfo;
  copiedField: string | null;
  isVerifying?: boolean;
  onCopy: (text: string, fieldName: string) => void;
  onCompletePayment: () => void;
  onOpenSepayGateway?: () => void;
};

export const CartStepPayment = ({
  orderInfo,
  copiedField,
  isVerifying = false,
  onCopy,
  onCompletePayment,
  onOpenSepayGateway,
}: CartStepPaymentProps) => {
  const t = useTranslations('cart');

  return (
    <div className="mx-auto max-w-2xl space-y-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
      <div className="space-y-2 border-b border-gray-100 pb-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <QrCode className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-900">{t('step3')}</h3>
        <p className="text-xs font-medium text-gray-500">#{orderInfo.orderCode}</p>
      </div>

      <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
        {/* VietQR Code Display */}
        <div className="flex flex-col items-center space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-xs">
          <div className="group relative rounded-xl border border-gray-100 bg-white p-3 shadow-xs">
            <Image
              src={orderInfo.qrUrl}
              alt="QR Code"
              width={224}
              height={224}
              unoptimized
              className="h-56 w-56 rounded-lg object-contain"
            />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-600" />
            <span>{t('step3')}...</span>
          </div>
        </div>

        {/* Transfer Details List */}
        <div className="space-y-3 text-xs">
          <div className="space-y-0.5 rounded-xl bg-gray-50 p-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Bank</span>
            <p className="leading-tight font-bold text-gray-900">{orderInfo.bankName}</p>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
            <div className="min-w-0 pr-2">
              <span className="block text-[10px] font-bold text-gray-400 uppercase">
                Account Name
              </span>
              <span className="block truncate text-xs font-extrabold text-gray-900">
                {orderInfo.accountName}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onCopy(orderInfo.accountName, 'accountName');
              }}
              className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg p-1.5 font-bold text-emerald-700 transition-colors hover:bg-emerald-100/50"
            >
              {copiedField === 'accountName' ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="text-[11px]">{copiedField === 'accountName' ? 'OK' : 'Copy'}</span>
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase">
                Account Number
              </span>
              <span className="text-xs font-extrabold text-gray-900 sm:text-sm">
                {orderInfo.accountNo}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onCopy(orderInfo.accountNo, 'stk');
              }}
              className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg p-1.5 font-bold text-emerald-700 transition-colors hover:bg-emerald-100/50"
            >
              {copiedField === 'stk' ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="text-[11px]">{copiedField === 'stk' ? 'OK' : 'Copy'}</span>
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase">
                Transfer Memo
              </span>
              <span className="text-xs font-extrabold text-emerald-800 sm:text-sm">
                {orderInfo.orderCode}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onCopy(orderInfo.orderCode, 'code');
              }}
              className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg p-1.5 font-bold text-emerald-700 transition-colors hover:bg-emerald-100/50"
            >
              {copiedField === 'code' ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="text-[11px]">{copiedField === 'code' ? 'OK' : 'Copy'}</span>
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-emerald-200/60 bg-emerald-50 p-3">
            <div>
              <span className="block text-[10px] font-bold text-emerald-700 uppercase">
                {t('total')}
              </span>
              <span className="text-sm font-black text-emerald-900 sm:text-base">
                {formatVNDPrice(orderInfo.amount)}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onCopy(orderInfo.amount.toString(), 'amount');
              }}
              className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg p-1.5 font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              {copiedField === 'amount' ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="text-[11px]">{copiedField === 'amount' ? 'OK' : 'Copy'}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row">
        <Button
          type="button"
          disabled={isVerifying}
          isLoading={isVerifying}
          onClick={onCompletePayment}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-xs font-bold text-white shadow-md shadow-emerald-700/20 transition-colors hover:bg-emerald-800 disabled:opacity-75"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>{isVerifying ? 'Verifying...' : 'Payment Transferred'}</span>
        </Button>

        {onOpenSepayGateway && (
          <Button
            type="button"
            variant="outline"
            onClick={onOpenSepayGateway}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3.5 text-xs font-bold text-gray-800 transition-colors hover:bg-gray-200"
          >
            <span>Gateway</span>
          </Button>
        )}
      </div>
    </div>
  );
};
