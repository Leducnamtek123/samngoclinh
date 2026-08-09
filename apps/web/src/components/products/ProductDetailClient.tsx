'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/I18nNavigation';
import { toast } from 'sonner';
import { useCatalogShopItem } from '@/hooks/queries/useCatalog';
import { getProductImage } from '@/utils/productUtils';
import { addToCart } from '@/utils/cart';

type ProductDetailClientProps = {
  id: string;
  locale: string;
  isLoggedIn?: boolean;
};

export const ProductDetailClient = ({ id, locale, isLoggedIn }: ProductDetailClientProps) => {
  const { data: product, isLoading, isError } = useCatalogShopItem(id);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 bg-gray-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-12 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-500 text-sm">Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không chính xác.</p>
        <Link
          href={`/${locale}/products`}
          className="inline-block bg-[#1C3F24] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors shadow-md"
        >
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const currentImage = getProductImage(product, activeImageIdx) || '/assets/images/logo_ruou_sam.png';

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=products`;
      return;
    }
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: currentImage,
        category: product.category || 'Sản phẩm',
      },
      quantity
    );
    toast.success(`Đã thêm ${quantity} "${product.name}" vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=products`;
      return;
    }
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: currentImage,
        category: product.category || 'Sản phẩm',
      },
      quantity
    );
    window.location.href = `/${locale}/cart`;
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href={`/${locale}`} className="hover:text-gray-900 transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href={`/${locale}/products`} className="hover:text-gray-900 transition-colors">Sản phẩm</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Card Details Container */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Gallery View */}
          <div className="space-y-4">
            <div className="h-80 sm:h-96 bg-gray-50 rounded-2xl border border-gray-100 relative overflow-hidden flex items-center justify-center p-4">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Thumbnail list */}
            {product?.images && Array.isArray(product.images) && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {product.images.map((imgUrl: string, idx: number) => (
                  <button
                    type="button"
                    key={imgUrl}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all cursor-pointer relative ${
                      activeImageIdx === idx ? 'border-[#1C3F24] ring-2 ring-emerald-100' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={imgUrl} alt={`Thumb ${idx + 1}`} fill sizes="64px" unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Info */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {product.category && (
                <span className="text-xs font-bold uppercase tracking-wider text-[#1C3F24] bg-emerald-50 px-3 py-1 rounded-full inline-block">
                  {product.category}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
                {product.name}
              </h1>

              {product.code && (
                <p className="text-xs text-gray-400 font-mono">
                  Mã sản phẩm: <span className="text-gray-700 font-semibold">{product.code}</span>
                </p>
              )}

              <div className="text-3xl font-black text-emerald-800">
                {(product.price || 0).toLocaleString('vi-VN')} đ
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Mô tả sản phẩm</h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  {product.description || 'Sản phẩm Sâm Ngọc Linh thượng hạng được chế biến và đóng gói bảo quản chuẩn chất lượng.'}
                </p>
              </div>

              {/* Quantity selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase text-gray-400 tracking-wider block">Số lượng</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-gray-600 hover:bg-gray-200 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 text-gray-600 hover:bg-gray-200 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 border-2 border-primary text-primary hover:bg-emerald-50 font-bold py-3.5 px-6 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                Thêm Vào Giỏ Hàng
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-colors shadow-lg cursor-pointer text-center"
              >
                Mua Ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
