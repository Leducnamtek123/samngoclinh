'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Zap, PackageCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProductImage } from '@/utils/productUtils';
import type { ProductItem } from '@/types';

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
  const [activeImageIdx, setActiveImageIdx] = useState<number>(initialImageIdx);
  const [quantity, setQuantity] = useState<number>(1);

  const mainImageSrc = getProductImage(product, activeImageIdx) || '/assets/images/logo_ruou_sam.png';

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-start ${className || ''}`}>
      {/* Gallery Viewer */}
      <div className="space-y-4">
        <div className="h-72 sm:h-96 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
          {mainImageSrc ? (
            <Image
              src={mainImageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="max-h-full max-w-full object-contain rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 text-xs font-medium space-y-1">
              <PackageCheck className="w-10 h-10 opacity-40" />
              <span>Không có hình ảnh</span>
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
                onClick={() => setActiveImageIdx(idx)}
                className={`w-14 h-14 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all cursor-pointer relative ${
                  activeImageIdx === idx
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-gray-200 dark:border-gray-800 opacity-70 hover:opacity-100'
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
      <div className="space-y-6 flex flex-col justify-between h-full">
        <div className="space-y-4">
          {product.category && (
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-primary dark:bg-emerald-950/60 dark:text-emerald-300 font-bold border border-emerald-200/60"
            >
              {product.category}
            </Badge>
          )}

          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100 leading-snug">
            {product.name}
          </h2>

          {product.code && (
            <p className="text-xs text-gray-400 font-mono">
              Mã sản phẩm: <span className="text-gray-700 dark:text-gray-300 font-semibold">{product.code}</span>
            </p>
          )}

          <div className="text-2xl sm:text-3xl font-black text-primary">
            {(product.price || 0).toLocaleString('vi-VN')} đ
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-1.5">
            <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Mô tả sản phẩm</h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              {product.description || 'Sản phẩm Sâm Ngọc Linh chuẩn nguồn gốc được kiểm định chất lượng nghiêm ngặt.'}
            </p>
          </div>

          {/* Quantity selector */}
          {showQuantity && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase text-gray-400 tracking-wider block">
                Số lượng
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-900 w-max">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-gray-900 dark:text-gray-100">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
          {onAddToCart && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onAddToCart(product, quantity)}
              className="flex-1 py-3 text-xs font-bold border-primary text-primary hover:bg-emerald-50 dark:hover:bg-emerald-950 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Thêm Vào Giỏ Hàng</span>
            </Button>
          )}

          {onBuyNow && (
            <Button
              type="button"
              variant="emerald"
              onClick={() => onBuyNow(product, quantity)}
              className="flex-1 py-3 text-xs font-bold shadow-md flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Mua Ngay</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
