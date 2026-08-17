'use client';

import React from 'react';
// @ts-expect-error react-dom type declaration
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Truck, Store, X } from 'lucide-react';
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
      data-lenis-prevent
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        className="relative bg-white dark:bg-slate-900 bg-card text-card-foreground rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-xl overflow-hidden border border-border shrink-0 transition-transform transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 border-b border-border bg-white dark:bg-slate-900 bg-card flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border border-primary/20 tracking-wider">
                {mode === 'plant' ? t('headerBadgePlant') : t('headerBadgeProduct')}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mt-1 text-foreground tracking-tight">
              {t('headerTitle')}
            </h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrollable Form Body */}
        <form data-lenis-prevent onSubmit={form.handleCheckoutSubmit} className="flex-1 overflow-y-auto overscroll-contain min-h-0 flex flex-col">
          <div className="p-6 space-y-6">
            {/* Product Overview Card */}
            <div className="flex gap-4 p-4 bg-muted/50 rounded-xl border border-border">
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
                  <div className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-lg border border-border shadow-xs">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => form.setQuantity(Math.max(1, form.quantity - 1))}
                      className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground font-bold text-xs cursor-pointer p-0 h-auto"
                    >
                      -
                    </Button>
                    <span className="w-6 text-center font-extrabold text-xs text-foreground">
                      {form.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => form.setQuantity(form.quantity + 1)}
                      className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground font-bold text-xs cursor-pointer p-0 h-auto"
                    >
                      +
                    </Button>
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

            {/* Shipping Method & Address Selection for Physical Products */}
            {mode === 'product' && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider block">
                    Phương thức nhận hàng
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => form.setDeliveryType('shipping')}
                      className={`p-3 rounded-xl border text-left transition-[border-color,background-color,box-shadow] cursor-pointer flex flex-col justify-between space-y-1 ${
                        form.deliveryType === 'shipping'
                          ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                          <span>{t('shippingLabel')}</span>
                        </span>
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                          30.000 đ
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {t('shippingDesc')}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => form.setDeliveryType('pickup')}
                      className={`p-3 rounded-xl border text-left transition-[border-color,background-color,box-shadow] cursor-pointer flex flex-col justify-between space-y-1 ${
                        form.deliveryType === 'pickup'
                          ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                          <Store className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                          <span>{t('pickupLabel')}</span>
                        </span>
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                          {t('pickupFree')}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {t('pickupDesc')}
                      </p>
                    </button>
                  </div>
                </div>

                {form.deliveryType === 'shipping' ? (
                  <AddressSelector
                    addresses={form.addresses}
                    selectedAddressId={form.selectedAddressId}
                    setSelectedAddressId={form.setSelectedAddressId}
                    onOpenAddAddressModal={() => form.setIsAddAddressModalOpen(true)}
                  />
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 rounded-xl p-4 space-y-1 text-xs">
                    <p className="font-bold text-gray-900 dark:text-gray-100">{t('pickupAddressTitle')}</p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                      {t('pickupAddressDesc')}
                    </p>
                  </div>
                )}
              </div>
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
              shippingFee={mode === 'product' ? form.shippingFee : undefined}
              grandTotal={form.grandTotal}
              t={t}
            />
          </div>

          {/* Sticky Footer Submit Actions */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-border bg-white dark:bg-slate-900 bg-card flex items-center justify-end gap-3 z-10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-5 py-2.5 font-bold rounded-xl text-xs"
            >
              {t('cancel')}
            </Button>

            <Button
              type="submit"
              disabled={form.submitting}
              className="px-6 py-2.5 font-bold rounded-xl text-xs transition-colors"
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
