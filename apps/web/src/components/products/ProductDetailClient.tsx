'use client';

import { Link } from '@/lib/I18nNavigation';
import { toast } from 'sonner';
import { useCatalogShopItem } from '@/hooks/queries/useCatalog';
import { getProductImage } from '@/utils/productUtils';
import { addToCart } from '@/utils/cart';
import { ProductDetailView } from './ProductDetailView';
import { ErrorState } from '@/components/common/ErrorState';
import type { ProductItem } from '@/types';

type ProductDetailClientProps = {
  id: string;
  locale: string;
  isLoggedIn?: boolean;
};

export const ProductDetailClient = ({ id, locale, isLoggedIn }: ProductDetailClientProps) => {
  const { data: product, isLoading, isError } = useCatalogShopItem(id);

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
          title="Không tìm thấy sản phẩm"
          description="Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không chính xác."
          retryLabel="Quay lại danh sách sản phẩm"
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
    toast.success(`Đã thêm ${quantity} "${item.name}" vào giỏ hàng!`);
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
          <Link href={`/${locale}`} className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href={`/${locale}/products`} className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Sản phẩm</Link>
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
      </div>
    </div>
  );
};
