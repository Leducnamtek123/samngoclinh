'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import type { GinsengPlantItem, ProductItem } from '@/types';
import { ProductDetailView } from './ProductDetailView';

export type ProductDetailModalProps = {
  selectedDetailProduct: (ProductItem | GinsengPlantItem) | null;
  activeImageIdx?: number;
  setActiveImageIdx?: (idx: number) => void;
  onClose: () => void;
  onBuyItem?: (
    e?: React.MouseEvent,
    item?: ProductItem | GinsengPlantItem,
    redirect?: boolean,
  ) => void;
};

export function ProductDetailModal({
  selectedDetailProduct,
  activeImageIdx = 0,
  onClose,
  onBuyItem,
}: ProductDetailModalProps) {
  const t = useTranslations('common');

  useEffect(() => {
    if (!selectedDetailProduct) {
      return;
    }
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, [selectedDetailProduct]);

  if (!selectedDetailProduct) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t('close')}
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-pointer border-0 bg-black/60 text-left backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <div
        data-lenis-prevent
        className="animate-in zoom-in-95 relative flex max-h-[88vh] w-full max-w-3xl shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card bg-white text-card-foreground shadow-xl transition-transform duration-200 dark:bg-slate-900"
      >
        {/* Sticky Header */}
        <div className="z-10 flex flex-shrink-0 items-center justify-between border-b border-border bg-card bg-white px-6 py-4 dark:bg-slate-900">
          <div className="flex min-w-0 items-center gap-2 pr-2">
            {selectedDetailProduct.category && (
              <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-primary uppercase">
                {selectedDetailProduct.category}
              </span>
            )}
            <h3 className="truncate text-base leading-snug font-bold text-foreground sm:text-lg">
              {selectedDetailProduct.name}
            </h3>
          </div>
          <button
            type="button"
            aria-label={t('close')}
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-muted font-bold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
          <ProductDetailView
            product={selectedDetailProduct}
            initialImageIdx={activeImageIdx}
            showQuantity={false}
            onAddToCart={(item) => {
              onBuyItem?.(undefined, item, false);
              onClose();
            }}
            onBuyNow={(item) => {
              onBuyItem?.(undefined, item, true);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
