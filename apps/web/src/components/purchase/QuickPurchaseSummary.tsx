'use client';

import React from 'react';

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
            <span>{t('plantPriceLabel', { quantity, price: unitPrice.toLocaleString('vi-VN') })}</span>
            <span>{treeBasePrice.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between text-gray-500 text-[11px]">
            <span>{t('vatTreeLabel')}</span>
            <span>+{vatTree.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-700 pt-1 border-t border-emerald-100">
            <span>{t('careFeeLabel', { name: selectedCareObj?.name || t('defaultPackage') })}</span>
            <span>+{totalCareFee.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between text-gray-500 text-[11px]">
            <span>{t('vatCareLabel')}</span>
            <span>+{vatCare.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-700 pt-1 border-t border-emerald-100">
            <span>{t('protectionFeeLabel', { name: selectedProtectionObj?.name || t('defaultPackage') })}</span>
            <span>+{totalProtectionFee.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between text-gray-500 text-[11px]">
            <span>{t('vatProtectionLabel')}</span>
            <span>+{vatProtection.toLocaleString('vi-VN')} đ</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between font-semibold text-gray-700">
            <span>{t('subtotalLabel', { quantity })}</span>
            <span>{productSubtotal.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between text-gray-500 text-[11px]">
            <span>{t('vatProduct8Label')}</span>
            <span>+{vatProduct8.toLocaleString('vi-VN')} đ</span>
          </div>
          {shippingFee !== undefined && (
            <div className="flex justify-between font-semibold text-gray-700 pt-1 border-t border-emerald-100">
              <span>Phí vận chuyển</span>
              <span className="text-emerald-700 font-bold">
                {shippingFee > 0 ? `+${shippingFee.toLocaleString('vi-VN')} đ` : 'Miễn phí'}
              </span>
            </div>
          )}
        </>
      )}

      <div className="flex justify-between items-center text-sm font-black text-primary pt-2 border-t border-emerald-200">
        <span>{t('grandTotalLabel')}</span>
        <span className="text-base sm:text-lg text-emerald-900 font-extrabold">{grandTotal.toLocaleString('vi-VN')} VNĐ</span>
      </div>
    </div>
  );
};
