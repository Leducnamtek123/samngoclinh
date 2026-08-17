'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ProductImageCollage } from './ProductImageCollage';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { formatVNDPrice } from '@/utils/formatters';
import type { ProductItem } from '@/types';

export interface ProductsGridProps {
  isLoading: boolean;
  isError: boolean;
  items: ProductItem[] | any[];
  isLoggedIn?: boolean;
  locale: string;
  onOpenDetail: (item: any) => void;
  onAddToCart: (e: React.MouseEvent, item: any) => void;
  onQuickPurchase: (item: any) => void;
  onClearFilters: () => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  isLoading,
  isError,
  items,
  isLoggedIn,
  locale,
  onOpenDetail,
  onAddToCart,
  onQuickPurchase,
  onClearFilters,
}) => {
  const t = useTranslations('products');
  const tActions = useTranslations('actions');

  if (isLoading) {
    return <LoadingState message={t('loading')} size="lg" />;
  }

  if (isError) {
    return <ErrorState message={t('error')} onRetry={onClearFilters} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={t('noProductsFound')}
        description={t('noProductsDesc')}
        actionLabel={tActions('clearFilters')}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item: any) => {
        const hasMultiImages = item?.images && Array.isArray(item.images) && item.images.length > 1;

        return (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between group"
          >
            {/* Product Image Panel */}
            <button
              type="button"
              onClick={() => onOpenDetail(item)}
              className="relative w-full h-64 bg-gray-50 flex items-center justify-center p-4 cursor-pointer text-left border-0"
            >
              {/* Category Badge */}
              {item.category && (
                <span className="absolute top-3 left-3 bg-primary/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
                  {item.category}
                </span>
              )}

              {/* Multi-Image Badge */}
              {hasMultiImages && (
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{item.images.length}</span>
                </span>
              )}

              <ProductImageCollage item={item} />
            </button>

            {/* Details Panel */}
            <div className="p-5 space-y-4">
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => onOpenDetail(item)}
                  className="font-extrabold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[40px] uppercase group-hover:text-primary transition-colors cursor-pointer text-left block w-full border-0"
                >
                  {item.name}
                </button>
              </div>

              <div className="text-secondary font-extrabold text-base pt-1">
                {formatVNDPrice(item.price || 0)}
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => onAddToCart(e, item)}
                  className="p-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                  title={t('addToCart')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isLoggedIn) {
                      window.location.href = `/${locale}/sign-in?reason=products`;
                      return;
                    }
                    onQuickPurchase(item);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-lg font-extrabold transition-colors duration-200 text-xs active:scale-98 shadow-xs cursor-pointer"
                >
                  {t('buyNow')}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
