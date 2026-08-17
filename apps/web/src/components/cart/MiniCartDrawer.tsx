'use client';

import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { Link } from '@/lib/I18nNavigation';
import { cartStore } from '@/lib/stores/useCartStore';
import type { CartItem } from '@/types';
import { formatVNDPrice } from '@/utils/formatters';

const emptyCartList: CartItem[] = [];

export const MiniCartDrawer = () => {
  const t = useTranslations('cart');
  const [isOpen, setIsOpen] = useState(false);
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    () => emptyCartList,
  );

  useEffect(() => {
    const handleOpenDrawer = () => {
      setIsOpen(true);
    };
    const handleCloseDrawer = () => {
      setIsOpen(false);
    };

    window.addEventListener('open_mini_cart', handleOpenDrawer);
    window.addEventListener('close_mini_cart', handleCloseDrawer);

    return () => {
      window.removeEventListener('open_mini_cart', handleOpenDrawer);
      window.removeEventListener('close_mini_cart', handleCloseDrawer);
    };
  }, []);

  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0,
  );

  const totalCount = items.reduce((count, item) => count + (Number(item.quantity) || 1), 0);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart drawer"
        className="animate-in fade-in fixed inset-0 cursor-pointer border-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => {
          setIsOpen(false);
        }}
      />

      {/* Drawer Panel */}
      <div className="animate-in slide-in-from-right relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-emerald-950 p-5 text-white dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-800/80 text-emerald-300">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-white">{t('step1')}</h3>
              <p className="text-xs font-medium text-emerald-300/80">
                {totalCount > 0 ? `${totalCount} ${t('itemCount')}` : t('emptyCart')}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close cart drawer"
            onClick={() => {
              setIsOpen(false);
            }}
            className="cursor-pointer rounded-xl p-2 text-emerald-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 space-y-4 divide-y divide-gray-100 overflow-y-auto p-5 dark:divide-gray-800">
          {items.length === 0 ? (
            <div className="space-y-3 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {t('emptyCart')}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-start gap-3.5 pt-4 first:pt-0">
                <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-1 dark:border-gray-700 dark:bg-slate-800">
                  <Image
                    src={item.image || '/assets/images/logo_ruou_sam.png'}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-xs leading-snug font-bold text-gray-900 sm:text-sm dark:text-gray-100">
                    {item.name}
                  </h4>
                  <div className="mt-1 text-xs font-black text-emerald-800 dark:text-emerald-400">
                    {formatVNDPrice(Number(item.price) || 0)}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-slate-800">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => cartStore.updateQuantity(item.id, -1)}
                        className="cursor-pointer p-1 text-gray-600 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-slate-700"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-gray-900 dark:text-gray-100">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => cartStore.updateQuantity(item.id, 1)}
                        className="cursor-pointer p-1 text-gray-600 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-slate-700"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => cartStore.removeItem(item.id)}
                      className="cursor-pointer p-1 text-gray-400 transition-colors hover:text-red-600"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="space-y-3 border-t border-gray-100 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-slate-900">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                {t('subtotal')}:
              </span>
              <span className="text-lg font-black text-emerald-800 dark:text-emerald-400">
                {formatVNDPrice(totalAmount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Link
                href="/cart"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-slate-800"
              >
                <span>{t('step1')}</span>
              </Link>
              <Link
                href="/checkout"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-800 px-4 py-3 text-center text-xs font-bold text-white shadow-md transition-colors hover:bg-emerald-900"
              >
                <span>{t('continueToCheckout')}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>PCI-DSS SSL 256-bit</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
