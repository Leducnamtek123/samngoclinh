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
    <div data-lenis-prevent className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 transition-opacity duration-200 animate-in fade-in">
      <div data-lenis-prevent className="bg-white dark:bg-slate-900 rounded-[20px] max-w-3xl w-full max-h-[min(88vh,820px)] flex flex-col overflow-hidden relative shadow-2xl transition-[opacity,transform] duration-200 animate-in zoom-in-95 border border-gray-100 dark:border-gray-800">
        {/* Sticky Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 rounded-t-[20px] shadow-2xs">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            {selectedDetailProduct.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200/60 shrink-0">
                {selectedDetailProduct.category}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-gray-100 leading-snug truncate">
              {selectedDetailProduct.name}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Đóng modal sản phẩm"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-300 flex items-center justify-center transition-colors font-bold cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div data-lenis-prevent className="flex-1 modal-content p-6 overflow-y-auto">
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
