'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import type { ProductItem } from '@/types';
import { formatVNDPrice } from '@/utils/formatters';
import { ProductImageCollage } from './ProductImageCollage';

export type ProductsGridProps = {
  isLoading: boolean;
  isError: boolean;
  items: ProductItem[];
  isLoggedIn?: boolean;
  locale: string;
  onOpenDetail: (item: ProductItem) => void;
  onAddToCart: (e: React.MouseEvent, item: ProductItem) => void;
  onQuickPurchase: (item: ProductItem) => void;
  onClearFilters: () => void;
};

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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item: ProductItem) => {
        const hasMultiImages = item?.images && Array.isArray(item.images) && item.images.length > 1;

        return (
          <div
            key={item.id}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-lg"
          >
            {/* Product Image Panel */}
            <button
              type="button"
              onClick={() => {
                onOpenDetail(item);
              }}
              className="relative flex h-64 w-full cursor-pointer items-center justify-center border-0 bg-gray-50 p-4 text-left"
            >
              {/* Category Badge */}
              {item.category && (
                <span className="absolute top-3 left-3 z-10 rounded-full bg-primary/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs">
                  {item.category}
                </span>
              )}

              {/* Multi-Image Badge */}
              {hasMultiImages && (
                <span className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{item.images?.length || 0}</span>
                </span>
              )}

              <ProductImageCollage item={item} />
            </button>

            {/* Details Panel */}
            <div className="space-y-4 p-5">
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onOpenDetail(item);
                  }}
                  className="line-clamp-2 block min-h-[40px] w-full cursor-pointer border-0 text-left text-sm leading-snug font-extrabold text-gray-900 uppercase transition-colors group-hover:text-primary"
                >
                  {item.name}
                </button>
              </div>

              <div className="pt-1 text-base font-extrabold text-secondary">
                {formatVNDPrice(item.price || 0)}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    onAddToCart(e, item);
                  }}
                  className="flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white p-2.5 text-gray-700 shadow-xs transition-colors hover:bg-gray-100"
                  title={t('addToCart')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
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
                  className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-extrabold text-white shadow-xs transition-colors duration-200 hover:bg-primary-hover active:scale-98"
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
