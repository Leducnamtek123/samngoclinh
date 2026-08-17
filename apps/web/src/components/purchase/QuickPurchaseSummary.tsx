'use client';

import React from 'react';
import { formatVNDPrice } from '@/utils/formatters';

type QuickPurchaseSummaryProps = {
  mode: 'plant' | 'product';
  quantity: number;
  unitPrice: number;
  treeBasePrice: number;
  vatTree: number;
  selectedCareObj?: { name?: string };
  totalCareFee: number;
  vatCare: number;
  selectedProtectionObj?: { name?: string };
  totalProtectionFee: number;
  vatProtection: number;
  productSubtotal: number;
  vatProduct8: number;
  shippingFee?: number;
  grandTotal: number;
  t: (key: string, params?: Record<string, any>) => string;
};

export const QuickPurchaseSummary: React.FC<QuickPurchaseSummaryProps> = ({
  mode,
  quantity,
  unitPrice,
  treeBasePrice,
  vatTree,
  selectedCareObj,
  totalCareFee,
  vatCare,
  selectedProtectionObj,
  totalProtectionFee,
  vatProtection,
  productSubtotal,
  vatProduct8,
  shippingFee,
  grandTotal,
  t,
}) => {
  return (
    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-2.5 text-xs">
      <h4 className="font-extrabold text-primary text-xs uppercase tracking-wider border-b border-emerald-200/60 pb-2">
        {t('breakdownTitle')}
      </h4>

      {mode === 'plant' ? (
        <>
          <div className="flex justify-between font-semibold text-gray-700">
            <span>{t('plantPriceLabel', { quantity, price: formatVNDPrice(unitPrice) })}</span>
            <span>{formatVNDPrice(treeBasePrice)}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-[11px]">
            <span>{t('vatTreeLabel')}</span>
            <span>+{formatVNDPrice(vatTree)}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-700 pt-1 border-t border-emerald-100">
            <span>{t('careFeeLabel', { name: selectedCareObj?.name || t('defaultPackage') })}</span>
            <span>+{formatVNDPrice(totalCareFee)}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-[11px]">
            <span>{t('vatCareLabel')}</span>
            <span>+{formatVNDPrice(vatCare)}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-700 pt-1 border-t border-emerald-100">
            <span>{t('protectionFeeLabel', { name: selectedProtectionObj?.name || t('defaultPackage') })}</span>
            <span>+{formatVNDPrice(totalProtectionFee)}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-[11px]">
            <span>{t('vatProtectionLabel')}</span>
            <span>+{formatVNDPrice(vatProtection)}</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between font-semibold text-gray-700">
            <span>{t('subtotalLabel', { quantity })}</span>
            <span>{formatVNDPrice(productSubtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-[11px]">
            <span>{t('vatProduct8Label')}</span>
            <span>+{formatVNDPrice(vatProduct8)}</span>
          </div>
          {shippingFee !== undefined && (
            <div className="flex justify-between font-semibold text-gray-700 pt-1 border-t border-emerald-100">
              <span>{t('shippingFeeLabel')}</span>
              <span className="text-emerald-700 font-bold">
                {shippingFee > 0 ? `+${formatVNDPrice(shippingFee)}` : t('freeShipping')}
              </span>
            </div>
          )}
        </>
      )}

      <div className="flex justify-between items-center text-sm font-black text-primary pt-2 border-t border-emerald-200">
        <span>{t('grandTotalLabel')}</span>
        <span className="text-base sm:text-lg text-emerald-900 font-extrabold">{formatVNDPrice(grandTotal)}</span>
      </div>
    </div>
  );
};
