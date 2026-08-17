'use client';

import { ShoppingCart, Zap, PackageCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ProductItem } from '@/types';
import { formatVNDPrice } from '@/utils/formatters';
import { getProductImage } from '@/utils/productUtils';

export type ProductDetailViewProps = {
  product: ProductItem;
  initialImageIdx?: number;
  showQuantity?: boolean;
  onAddToCart?: (product: ProductItem, quantity: number) => void;
  onBuyNow?: (product: ProductItem, quantity: number) => void;
  className?: string;
};

export function ProductDetailView({
  product,
  initialImageIdx = 0,
  showQuantity = true,
  onAddToCart,
  onBuyNow,
  className,
}: ProductDetailViewProps) {
  const t = useTranslations('products');

  const [activeImageIdx, setActiveImageIdx] = useState<number>(initialImageIdx);
  const [quantity, setQuantity] = useState<number>(1);

  const mainImageSrc =
    getProductImage(product, activeImageIdx) || '/assets/images/logo_ruou_sam.png';

  return (
    <div className={`grid grid-cols-1 items-start gap-8 md:grid-cols-2 ${className || ''}`}>
      {/* Gallery Viewer */}
      <div className="space-y-4">
        <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:h-96 dark:border-gray-800 dark:bg-slate-900">
          {mainImageSrc ? (
            <Image
              src={mainImageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="max-h-full max-w-full rounded-xl object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1 text-xs font-medium text-gray-400">
              <PackageCheck className="h-10 w-10 opacity-40" />
              <span>{t('noImage')}</span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {product?.images && Array.isArray(product.images) && product.images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto py-1">
            {product.images.map((imgUrl: string, idx: number) => (
              <button
                type="button"
                key={imgUrl}
                onClick={() => {
                  setActiveImageIdx(idx);
                }}
                className={`relative h-14 w-14 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-[border-color,box-shadow,opacity] ${
                  activeImageIdx === idx
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-gray-200 opacity-70 hover:opacity-100 dark:border-gray-800'
                }`}
              >
                <Image
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info & Actions */}
      <div className="flex h-full flex-col justify-between space-y-6">
        <div className="space-y-4">
          {product.category && (
            <Badge
              variant="secondary"
              className="border border-emerald-200/60 bg-emerald-50 font-bold text-primary dark:bg-emerald-950/60 dark:text-emerald-300"
            >
              {product.category}
            </Badge>
          )}

          <h2 className="text-xl leading-snug font-extrabold text-gray-900 sm:text-2xl dark:text-gray-100">
            {product.name}
          </h2>

          {product.code && (
            <p className="font-mono text-xs text-gray-400">
              {t('productCode')}:{' '}
              <span className="font-semibold text-gray-700 dark:text-gray-300">{product.code}</span>
            </p>
          )}

          <div className="font-display text-2xl font-black text-primary sm:text-3xl">
            {formatVNDPrice(product.price || 0)}
          </div>

          <div className="space-y-1.5 border-t border-gray-100 pt-4 dark:border-gray-800">
            <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              {t('description')}
            </h4>
            <p className="text-xs leading-relaxed font-normal text-gray-600 sm:text-sm dark:text-gray-400">
              {product.description || t('guaranteedQuality')}
            </p>
          </div>

          {/* Quantity selector */}
          {showQuantity && (
            <div className="space-y-2 pt-2">
              <span className="block text-xs font-bold tracking-wider text-gray-400 uppercase">
                {t('quantity')}
              </span>
              <div className="flex w-max items-center overflow-hidden rounded-xl border border-gray-300 bg-gray-50 shadow-2xs dark:border-gray-700 dark:bg-slate-900">
                <button
                  type="button"
                  aria-label={t('decreaseQuantity')}
                  onClick={() => {
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  className="cursor-pointer px-3.5 py-2 font-bold text-gray-600 transition-colors hover:bg-gray-200 active:scale-90 dark:text-gray-300 dark:hover:bg-slate-800"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-gray-900 select-none dark:text-gray-100">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label={t('increaseQuantity')}
                  onClick={() => {
                    setQuantity(quantity + 1);
                  }}
                  className="cursor-pointer px-3.5 py-2 font-bold text-gray-600 transition-colors hover:bg-gray-200 active:scale-90 dark:text-gray-300 dark:hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row dark:border-gray-800">
          {onAddToCart && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onAddToCart(product, quantity);
              }}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-primary py-3.5 text-xs font-bold text-primary shadow-2xs transition-[transform,background-color] hover:bg-emerald-50 active:scale-[0.98] dark:hover:bg-emerald-950"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{t('addToCart')}</span>
            </Button>
          )}

          {onBuyNow && (
            <Button
              type="button"
              variant="emerald"
              onClick={() => {
                onBuyNow(product, quantity);
              }}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-white shadow-md transition-[transform,background-color,box-shadow] hover:bg-primary-hover hover:shadow-lg active:scale-[0.98]"
            >
              <Zap className="h-4 w-4 text-amber-300" />
              <span>{t('buyNow')}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
