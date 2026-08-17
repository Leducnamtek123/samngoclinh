'use client';

import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { toast } from 'sonner';
import { ErrorState } from '@/components/common/ErrorState';
import { useCatalogShopItem, useCatalogShopItems } from '@/hooks/queries/useCatalog';
import { Link } from '@/lib/I18nNavigation';
import type { ProductItem } from '@/types';
import { addToCart } from '@/utils/cart';
import type { CartItem } from '@/utils/cart';
import { formatVNDPrice } from '@/utils/formatters';
import { getProductImage } from '@/utils/productUtils';
import { ProductDetailView } from './ProductDetailView';

type ProductDetailClientProps = {
  id: string;
  locale: string;
  isLoggedIn?: boolean;
  initialData?: ProductItem | null;
};

export const ProductDetailClient = ({
  id,
  locale,
  isLoggedIn,
  initialData,
}: ProductDetailClientProps) => {
  const t = useTranslations('productDetail');
  const { data: product, isLoading, isError } = useCatalogShopItem(id, initialData);
  const { data: allShopItems } = useCatalogShopItems();

  const relatedProducts = Array.isArray(allShopItems)
    ? allShopItems.filter((item: ProductItem) => item.id !== id).slice(0, 6)
    : [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse space-y-8 px-4 py-16 sm:px-6">
        <div className="h-6 w-32 rounded bg-gray-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="h-96 rounded-3xl bg-gray-200 dark:bg-slate-800" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-24 rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-12 w-full rounded bg-gray-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
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
      quantity,
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
    const buyItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: currentImage,
      category: item.category || 'Sản phẩm',
      quantity,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('checkout_selected_items:v1', JSON.stringify([buyItem]));
    }
    window.location.href = `/${locale}/checkout`;
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-10 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <Link
            href={`/${locale}`}
            className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            {t('home')}
          </Link>
          <span>/</span>
          <Link
            href={`/${locale}/products`}
            className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            {t('products')}
          </Link>
          <span>/</span>
          <span className="max-w-xs truncate font-bold text-gray-900 dark:text-gray-100">
            {product.name}
          </span>
        </nav>

        {/* Product Details Container */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10 dark:border-gray-800 dark:bg-slate-900">
          <ProductDetailView
            product={product}
            showQuantity={true}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6 sm:p-8 dark:border-gray-800 dark:bg-slate-900/50">
            <h3 className="text-center text-lg font-extrabold text-gray-900 dark:text-gray-100">
              {t('relatedProducts')}
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {relatedProducts.map((relItem: ProductItem) => {
                const relImg = getProductImage(relItem, 0) || '/assets/images/logo_ruou_sam.png';
                return (
                  <div
                    key={relItem.id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-slate-900"
                  >
                    <Link
                      href={`/${locale}/products/${relItem.id}`}
                      className="relative block h-48 w-full bg-gray-50 p-4 dark:bg-slate-800"
                    >
                      <Image
                        src={relImg}
                        alt={relItem.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-2 transition-transform duration-300 hover:scale-105"
                        unoptimized
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                      <div className="space-y-1">
                        <Link
                          href={`/${locale}/products/${relItem.id}`}
                          className="line-clamp-2 text-xs font-bold text-gray-900 uppercase transition-colors hover:text-emerald-700 dark:text-gray-100"
                        >
                          {relItem.name}
                        </Link>
                        <p className="text-sm font-extrabold text-emerald-700">
                          {formatVNDPrice(relItem.price || 0)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 border-t border-gray-100 pt-2 dark:border-gray-800">
                        <button
                          type="button"
                          onClick={() => {
                            handleAddToCart(relItem, 1);
                          }}
                          className="cursor-pointer rounded-lg border border-gray-200 p-2 text-xs font-bold text-gray-700 transition-[transform,background-color] hover:bg-gray-50 active:scale-[0.96] dark:border-gray-700 dark:text-gray-300"
                          title={t('addToCart')}
                        >
                          <ShoppingCart className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleBuyNow(relItem, 1);
                          }}
                          className="flex-1 cursor-pointer rounded-lg bg-emerald-700 py-2 text-center text-xs font-bold text-white shadow-xs transition-[transform,background-color] hover:bg-emerald-800 active:scale-[0.98]"
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
