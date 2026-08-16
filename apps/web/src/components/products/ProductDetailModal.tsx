'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { ProductDetailView } from './ProductDetailView';
import type { ProductItem } from '@/types';

export type ProductDetailModalProps = {
  selectedDetailProduct: ProductItem | null;
  activeImageIdx?: number;
  setActiveImageIdx?: (idx: number) => void;
  onClose: () => void;
  onBuyItem: (e: React.MouseEvent, item: ProductItem, redirect?: boolean) => void;
};

export function ProductDetailModal({
  selectedDetailProduct,
  activeImageIdx = 0,
  onClose,
  onBuyItem,
}: ProductDetailModalProps) {
  useEffect(() => {
    if (!selectedDetailProduct) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, [selectedDetailProduct]);

  if (!selectedDetailProduct) return null;

  return (
    <div data-lenis-prevent className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 transition-opacity duration-200 animate-in fade-in overflow-y-auto">
      <div data-lenis-prevent className="bg-white dark:bg-slate-900 bg-card text-card-foreground rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden relative shadow-xl border border-border shrink-0 transition-transform duration-200 animate-in zoom-in-95">
        {/* Sticky Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-border flex items-center justify-between bg-white dark:bg-slate-900 bg-card z-10">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            {selectedDetailProduct.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 shrink-0">
                {selectedDetailProduct.category}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug truncate">
              {selectedDetailProduct.name}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Đóng modal sản phẩm"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors font-bold cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div data-lenis-prevent className="flex-1 p-6 overflow-y-auto overscroll-contain min-h-0">
          <ProductDetailView
            product={selectedDetailProduct}
            initialImageIdx={activeImageIdx}
            showQuantity={false}
            onAddToCart={(item) => {
              onBuyItem({} as any, item, false);
              onClose();
            }}
            onBuyNow={(item) => {
              onBuyItem({} as any, item, true);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
