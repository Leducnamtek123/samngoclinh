'use client';

import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/I18nNavigation';
import { toast } from 'sonner';
import { useCatalogShopItem, useCatalogShopItems } from '@/hooks/queries/useCatalog';
import { getProductImage } from '@/utils/productUtils';
import { addToCart } from '@/utils/cart';
import { ProductDetailView } from './ProductDetailView';
import { ErrorState } from '@/components/common/ErrorState';
import type { ProductItem } from '@/types';

type ProductDetailClientProps = {
  id: string;
  locale: string;
  isLoggedIn?: boolean;
  initialData?: any;
};

export const ProductDetailClient = ({ id, locale, isLoggedIn, initialData }: ProductDetailClientProps) => {
  const t = useTranslations('productDetail');
  const { data: product, isLoading, isError } = useCatalogShopItem(id, initialData);
  const { data: allShopItems } = useCatalogShopItems();

  const relatedProducts = Array.isArray(allShopItems)
    ? allShopItems.filter((item: ProductItem) => item.id !== id).slice(0, 6)
    : [];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 bg-gray-200 dark:bg-slate-800 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 dark:bg-slate-800 rounded"></div>
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-slate-800 rounded"></div>
            <div className="h-24 bg-gray-200 dark:bg-slate-800 rounded"></div>
            <div className="h-12 w-full bg-gray-200 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4">
        <ErrorState
          title={t('notFoundTitle')}
          description={t('notFoundDesc')}
          retryLabel={t('backToProducts')}
          onRetry={() => {
            window.location.href = `/${locale}/products`;
          }}
        />
      </div>
    );
  }

  const handleAddToCart = (item: ProductItem, quantity: number) => {
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=products`;
      return;
    }
    const currentImage = getProductImage(item, 0) || '/assets/images/logo_ruou_sam.png';
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: currentImage,
        category: item.category || 'Sản phẩm',
      },
      quantity
    );
    toast.success(t('addedToCartToast', { quantity, name: item.name }));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open_mini_cart'));
    }
  };

  const handleBuyNow = (item: ProductItem, quantity: number) => {
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=products`;
      return;
    }
    const currentImage = getProductImage(item, 0) || '/assets/images/logo_ruou_sam.png';
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: currentImage,
        category: item.category || 'Sản phẩm',
      },
      quantity
    );
    window.location.href = `/${locale}/cart`;
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
          <Link href={`/${locale}`} className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">{t('home')}</Link>
          <span>/</span>
          <Link href={`/${locale}/products`} className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">{t('products')}</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Container */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm">
          <ProductDetailView
            product={product}
            showQuantity={true}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="bg-emerald-50/50 dark:bg-slate-900/50 border border-emerald-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100 text-center">
              {t('relatedProducts')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((relItem: ProductItem) => {
                const relImg = getProductImage(relItem, 0) || '/assets/images/logo_ruou_sam.png';
                return (
                  <div
                    key={relItem.id}
                    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <Link
                      href={`/${locale}/products/${relItem.id}`}
                      className="block relative w-full h-48 bg-gray-50 dark:bg-slate-800 p-4"
                    >
                      <Image
                        src={relImg}
                        alt={relItem.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </Link>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <Link
                          href={`/${locale}/products/${relItem.id}`}
                          className="font-bold text-xs text-gray-900 dark:text-gray-100 uppercase line-clamp-2 hover:text-emerald-700 transition-colors"
                        >
                          {relItem.name}
                        </Link>
                        <p className="text-emerald-700 font-extrabold text-sm">
                          {(relItem.price || 0).toLocaleString('vi-VN')} đ
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(relItem, 1)}
                          className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 text-gray-700 dark:text-gray-300 text-xs font-bold cursor-pointer transition-[transform,background-color] active:scale-[0.96]"
                          title={t('addToCart')}
                        >
                          <ShoppingCart className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBuyNow(relItem, 1)}
                          className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg text-xs font-bold transition-[transform,background-color] active:scale-[0.98] cursor-pointer text-center shadow-xs"
                        >
                          {t('buyNow')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
