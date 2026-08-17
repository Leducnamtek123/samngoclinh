'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from '@/lib/I18nNavigation';
import { cartStore } from '@/lib/stores/useCartStore';
import type { CartItem } from '@/types';
import { formatVNDPrice } from '@/utils/formatters';

const emptyCartList: CartItem[] = [];

export const MiniCartDrawer = () => {
  const t = useTranslations('cart');
  const [isOpen, setIsOpen] = useState(false);
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, () => emptyCartList);

  useEffect(() => {
    const handleOpenDrawer = () => setIsOpen(true);
    const handleCloseDrawer = () => setIsOpen(false);

    window.addEventListener('open_mini_cart', handleOpenDrawer);
    window.addEventListener('close_mini_cart', handleCloseDrawer);

    return () => {
      window.removeEventListener('open_mini_cart', handleOpenDrawer);
      window.removeEventListener('close_mini_cart', handleCloseDrawer);
    };
  }, []);

  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const totalCount = items.reduce(
    (count, item) => count + (Number(item.quantity) || 1),
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart drawer"
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer border-0"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl h-full flex flex-col z-10 transition-transform animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-emerald-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-emerald-800/80 flex items-center justify-center text-emerald-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white">{t('step1')}</h3>
              <p className="text-xs text-emerald-300/80 font-medium">
                {totalCount > 0 ? `${totalCount} ${t('itemCount')}` : t('emptyCart')}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close cart drawer"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {t('emptyCart')}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                <div className="size-20 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-gray-700 flex-shrink-0 relative overflow-hidden p-1">
                  <Image
                    src={item.image || '/assets/images/logo_ruou_sam.png'}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
                    {item.name}
                  </h4>
                  <div className="text-xs font-black text-emerald-800 dark:text-emerald-400 mt-1">
                    {formatVNDPrice(Number(item.price) || 0)}
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-800">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => cartStore.updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-gray-900 dark:text-gray-100">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => cartStore.updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => cartStore.removeItem(item.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{t('subtotal')}:</span>
              <span className="text-lg font-black text-emerald-800 dark:text-emerald-400">
                {formatVNDPrice(totalAmount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 text-center font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{t('step1')}</span>
              </Link>
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-center font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{t('continueToCheckout')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PCI-DSS SSL 256-bit</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
