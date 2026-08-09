'use client';

import React from 'react';
// @ts-expect-error react-dom type declaration
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { AddressModal } from '@/components/address/AddressModal';
import { PlantPackageSelector } from './PlantPackageSelector';
import { AddressSelector } from '@/components/address/AddressSelector';
import { QuickPurchaseTerms } from './QuickPurchaseTerms';
import { QuickPurchaseSummary } from './QuickPurchaseSummary';
import { useQuickPurchaseForm } from './useQuickPurchaseForm';
import type { Order } from '@/types';

export type QuickPurchaseItem = {
  id: string;
  name: string;
  price: number;
  stock?: number;
  image?: string;
  images?: string[];
  imageUrl?: string;
  category?: string;
  code?: string;
  ageYear?: number;
};

type QuickPurchaseModalProps = {
  item: QuickPurchaseItem | null;
  mode: 'plant' | 'product';
  locale: string;
  isLoggedIn?: boolean;
  onClose: () => void;
  onSuccessPayment?: (orderData: Order) => void;
};

export const QuickPurchaseModal: React.FC<QuickPurchaseModalProps> = ({
  item,
  mode,
  locale,
  isLoggedIn = false,
  onClose,
  onSuccessPayment,
}) => {
  const t = useTranslations('quickPurchase');
  
  const form = useQuickPurchaseForm({
    item,
    mode,
    locale,
    isLoggedIn,
    onClose,
    onSuccessPayment,
    t,
  });

  if (!item) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[24px] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-emerald-950/10 transition-all transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 sm:px-7 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white flex items-center justify-between z-10 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 tracking-wider">
                {mode === 'plant' ? t('headerBadgePlant') : t('headerBadgeProduct')}
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-black mt-1 text-white tracking-tight">
              {t('headerTitle')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={form.handleCheckoutSubmit} className="flex-1 overflow-y-auto min-h-0 flex flex-col modal-content">
          <div className="p-5 sm:p-7 space-y-6 flex-1">
            {/* Product Overview Card */}
            <div className="flex gap-4 p-3.5 bg-brand-bg rounded-2xl border border-emerald-900/10">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-gray-100 shadow-sm">
                <Image
                  src={form.itemImage}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm sm:text-base truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    {t('stockAvailable', { count: form.stockCount })}
                  </p>
                </div>
                <div className="flex items-baseline justify-between gap-2 mt-2">
                  <span className="text-emerald-800 font-black text-sm sm:text-base">
                    {form.unitPrice.toLocaleString('vi-VN')} VNĐ
                  </span>
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-xs">
                    <button
                      type="button"
                      onClick={() => form.setQuantity(Math.max(1, form.quantity - 1))}
                      className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-900 font-bold text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-extrabold text-xs text-gray-800">
                      {form.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => form.setQuantity(form.quantity + 1)}
                      className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-900 font-bold text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Plant Care & Protection Package Selection */}
            {mode === 'plant' && (
              <PlantPackageSelector
                carePackagesList={form.carePackages}
                protectionPackagesList={form.protectionPackages}
                selectedCareId={form.selectedCareId}
                setSelectedCareId={form.setSelectedCareId}
                selectedProtectionId={form.selectedProtectionId}
                setSelectedProtectionId={form.setSelectedProtectionId}
              />
            )}

            {/* Shipping Address Selection for Physical Products */}
            {mode === 'product' && (
              <AddressSelector
                addresses={form.addresses}
                selectedAddressId={form.selectedAddressId}
                setSelectedAddressId={form.setSelectedAddressId}
                onOpenAddAddressModal={() => form.setIsAddAddressModalOpen(true)}
              />
            )}

            {/* Terms Agreement Checkbox for Plants */}
            {mode === 'plant' && (
              <QuickPurchaseTerms
                agreedTerms={form.agreedTerms}
                setAgreedTerms={form.setAgreedTerms}
                t={t}
              />
            )}

            {/* Pricing Breakdown Summary */}
            <QuickPurchaseSummary
              mode={mode}
              quantity={form.quantity}
              unitPrice={form.unitPrice}
              treeBasePrice={form.treeBasePrice}
              vatTree={form.vatTree}
              selectedCareObj={form.selectedCareObj}
              totalCareFee={form.totalCareFee}
              vatCare={form.vatCare}
              selectedProtectionObj={form.selectedProtectionObj}
              totalProtectionFee={form.totalProtectionFee}
              vatProtection={form.vatProtection}
              productSubtotal={form.productSubtotal}
              vatProduct8={form.vatProduct8}
              grandTotal={form.grandTotal}
              t={t}
            />
          </div>

          {/* Sticky Footer Submit Actions */}
          <div className="flex-shrink-0 px-5 sm:px-7 py-4 border-t border-gray-100 bg-white flex gap-3 z-10 rounded-b-[20px] shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-5 py-3 font-bold rounded-xl text-xs h-auto"
            >
              {t('cancel')}
            </Button>

            <Button
              type="submit"
              disabled={form.submitting}
              className="flex-1 bg-primary hover:bg-emerald-900 active:bg-emerald-950 text-white font-extrabold py-3.5 rounded-xl text-xs h-auto transition-colors shadow-md shadow-emerald-900/20"
            >
              {form.submitting ? (
                <span>{t('submitInitializing')}</span>
              ) : (
                <span>{t('submitConfirm')}</span>
              )}
            </Button>
          </div>
        </form>

        <AddressModal
          isOpen={form.isAddAddressModalOpen}
          mode="add"
          onClose={() => form.setIsAddAddressModalOpen(false)}
          onSubmitSuccess={form.handleAddAddressSuccess}
        />
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
};
