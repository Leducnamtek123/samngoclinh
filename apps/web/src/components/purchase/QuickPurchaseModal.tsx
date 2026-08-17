'use client';

import { Truck, Store, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { createPortal } from 'react-dom';
import { AddressModal } from '@/components/address/AddressModal';
import { AddressSelector } from '@/components/address/AddressSelector';
import { Button } from '@/components/ui/button';
import type { Order } from '@/types';
import { PlantPackageSelector } from './PlantPackageSelector';
import { QuickPurchaseSummary } from './QuickPurchaseSummary';
import { QuickPurchaseTerms } from './QuickPurchaseTerms';
import { useQuickPurchaseForm } from './useQuickPurchaseForm';

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

  if (!item) {
    return null;
  }

  const modalContent = (
    <div
      data-lenis-prevent
      className="animate-in fade-in fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs transition-opacity duration-200 sm:p-6"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        className="animate-in zoom-in-95 relative flex max-h-[88vh] w-full max-w-2xl shrink-0 transform flex-col overflow-hidden rounded-2xl border border-border bg-card bg-white text-card-foreground shadow-xl transition-transform duration-200 dark:bg-slate-900"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="z-10 flex flex-shrink-0 items-center justify-between border-b border-border bg-card bg-white px-6 py-5 dark:bg-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase">
                {mode === 'plant' ? t('headerBadgePlant') : t('headerBadgeProduct')}
              </span>
            </div>
            <h3 className="mt-1 text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {t('headerTitle')}
            </h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 cursor-pointer rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Form Body */}
        <form
          data-lenis-prevent
          onSubmit={form.handleCheckoutSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
        >
          <div className="space-y-6 p-6">
            {/* Product Overview Card */}
            <div className="flex gap-4 rounded-xl border border-border bg-muted/50 p-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm sm:h-24 sm:w-24">
                <Image
                  src={form.itemImage}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                <div>
                  <h4 className="truncate text-sm font-extrabold text-gray-900 sm:text-base">
                    {item.name}
                  </h4>
                  <p className="mt-0.5 text-xs font-medium text-gray-500">
                    {t('stockAvailable', { count: form.stockCount })}
                  </p>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <span className="text-sm font-black text-emerald-800 sm:text-base">
                    {form.unitPrice.toLocaleString('vi-VN')} VNĐ
                  </span>
                  <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 shadow-xs">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        form.setQuantity(Math.max(1, form.quantity - 1));
                      }}
                      className="flex h-5 h-auto w-5 cursor-pointer items-center justify-center p-0 text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                      -
                    </Button>
                    <span className="w-6 text-center text-xs font-extrabold text-foreground">
                      {form.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        form.setQuantity(form.quantity + 1);
                      }}
                      className="flex h-5 h-auto w-5 cursor-pointer items-center justify-center p-0 text-xs font-bold text-muted-foreground hover:text-foreground"
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
                  <span className="block text-xs font-bold tracking-wider text-gray-800 uppercase dark:text-gray-200">
                    Phương thức nhận hàng
                  </span>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        form.setDeliveryType('shipping');
                      }}
                      className={`flex cursor-pointer flex-col justify-between space-y-1 rounded-xl border p-3 text-left transition-[border-color,background-color,box-shadow] ${
                        form.deliveryType === 'shipping'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-extrabold text-gray-900 dark:text-gray-100">
                          <Truck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                          <span>{t('shippingLabel')}</span>
                        </span>
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                          30.000 đ
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-gray-500">{t('shippingDesc')}</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        form.setDeliveryType('pickup');
                      }}
                      className={`flex cursor-pointer flex-col justify-between space-y-1 rounded-xl border p-3 text-left transition-[border-color,background-color,box-shadow] ${
                        form.deliveryType === 'pickup'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-extrabold text-gray-900 dark:text-gray-100">
                          <Store className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                          <span>{t('pickupLabel')}</span>
                        </span>
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                          {t('pickupFree')}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-gray-500">{t('pickupDesc')}</p>
                    </button>
                  </div>
                </div>

                {form.deliveryType === 'shipping' ? (
                  <AddressSelector
                    addresses={form.addresses}
                    selectedAddressId={form.selectedAddressId}
                    setSelectedAddressId={form.setSelectedAddressId}
                    onOpenAddAddressModal={() => {
                      form.setIsAddAddressModalOpen(true);
                    }}
                  />
                ) : (
                  <div className="space-y-1 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs dark:border-gray-700/60 dark:bg-gray-800/40">
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {t('pickupAddressTitle')}
                    </p>
                    <p className="leading-relaxed font-medium text-gray-600 dark:text-gray-300">
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
          <div className="z-10 flex flex-shrink-0 items-center justify-end gap-3 border-t border-border bg-card bg-white px-6 py-4 dark:bg-slate-900">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-xs font-bold"
            >
              {t('cancel')}
            </Button>

            <Button
              type="submit"
              disabled={form.submitting}
              className="rounded-xl px-6 py-2.5 text-xs font-bold transition-colors"
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
          onClose={() => {
            form.setIsAddAddressModalOpen(false);
          }}
          onSubmitSuccess={form.handleAddAddressSuccess}
        />
      </div>
    </div>
  );

  if (typeof window === 'undefined') {
    return null;
  }
  return createPortal(modalContent, document.body);
};
