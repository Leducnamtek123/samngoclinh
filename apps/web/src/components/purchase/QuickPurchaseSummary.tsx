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
}) => (
  <div className="space-y-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-xs">
    <h4 className="border-b border-emerald-200/60 pb-2 text-xs font-extrabold tracking-wider text-primary uppercase">
      {t('breakdownTitle')}
    </h4>

    {mode === 'plant' ? (
      <>
        <div className="flex justify-between font-semibold text-gray-700">
          <span>{t('plantPriceLabel', { quantity, price: formatVNDPrice(unitPrice) })}</span>
          <span>{formatVNDPrice(treeBasePrice)}</span>
        </div>
        <div className="flex justify-between text-[11px] text-gray-500">
          <span>{t('vatTreeLabel')}</span>
          <span>+{formatVNDPrice(vatTree)}</span>
        </div>
        <div className="flex justify-between border-t border-emerald-100 pt-1 font-semibold text-gray-700">
          <span>{t('careFeeLabel', { name: selectedCareObj?.name || t('defaultPackage') })}</span>
          <span>+{formatVNDPrice(totalCareFee)}</span>
        </div>
        <div className="flex justify-between text-[11px] text-gray-500">
          <span>{t('vatCareLabel')}</span>
          <span>+{formatVNDPrice(vatCare)}</span>
        </div>
        <div className="flex justify-between border-t border-emerald-100 pt-1 font-semibold text-gray-700">
          <span>
            {t('protectionFeeLabel', {
              name: selectedProtectionObj?.name || t('defaultPackage'),
            })}
          </span>
          <span>+{formatVNDPrice(totalProtectionFee)}</span>
        </div>
        <div className="flex justify-between text-[11px] text-gray-500">
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
        <div className="flex justify-between text-[11px] text-gray-500">
          <span>{t('vatProduct8Label')}</span>
          <span>+{formatVNDPrice(vatProduct8)}</span>
        </div>
        {shippingFee !== undefined && (
          <div className="flex justify-between border-t border-emerald-100 pt-1 font-semibold text-gray-700">
            <span>{t('shippingFeeLabel')}</span>
            <span className="font-bold text-emerald-700">
              {shippingFee > 0 ? `+${formatVNDPrice(shippingFee)}` : t('freeShipping')}
            </span>
          </div>
        )}
      </>
    )}

    <div className="flex items-center justify-between border-t border-emerald-200 pt-2 text-sm font-black text-primary">
      <span>{t('grandTotalLabel')}</span>
      <span className="text-base font-extrabold text-emerald-900 sm:text-lg">
        {formatVNDPrice(grandTotal)}
      </span>
    </div>
  </div>
);
