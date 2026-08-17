'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useCatalogShopItems } from '@/hooks/queries/useCatalog';
import { useBanner } from '@/hooks/queries/useBanner';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { addToCart } from '@/utils/cart';
import { QuickPurchaseModal } from '@/components/purchase/QuickPurchaseModal';
import { getProductImage } from '@/utils/productUtils';
import { ProductFilterSidebar } from './products/ProductFilterSidebar';
import { ProductDetailModal } from './products/ProductDetailModal';
import { ProductsGrid } from './products/ProductsGrid';
import { SearchInput } from '@/components/common/SearchInput';
import type { ProductItem } from '@/types';

type ProductsClientProps = {
  locale: string;
  initialItems?: ProductItem[];
  isLoggedIn?: boolean;
};

export const ProductsClient = ({ locale, initialItems, isLoggedIn }: ProductsClientProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: items, isLoading, isError } = useCatalogShopItems(initialItems);
  const { data: banners } = useBanner('products');

  // Initialize state from URL search params if present
  const initialQ = searchParams.get('q') || '';
  const initialCat = searchParams.get('category') || null;
  const initialMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 50000;
  const initialMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 5000000;

  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCat);
  const [minPrice, setMinPrice] = useState<number>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);

  // Multi-image detail modal state
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<ProductItem | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quickPurchaseProduct, setQuickPurchaseProduct] = useState<ProductItem | null>(null);

  // Sync state changes back to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (minPrice !== 50000) params.set('minPrice', String(minPrice));
    if (maxPrice !== 5000000) params.set('maxPrice', String(maxPrice));

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    if (typeof window !== 'undefined' && window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [searchTerm, selectedCategory, minPrice, maxPrice, pathname]);

  const handleAddToCartOnly = (e: React.MouseEvent, item: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=cart`;
      return;
    }
    if (!item?.id) return;
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: getProductImage(item, 0) || '',
      category: item.category || 'Sản phẩm',
    });
    toast.success(`Đã thêm "${item.name}" vào giỏ hàng!`);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open_mini_cart'));
    }
  };

  const handleBuyItem = (e: React.MouseEvent, item: ProductItem) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=products`;
      return;
    }
    if (!item) return;
    setSelectedDetailProduct(null);
    setQuickPurchaseProduct(item);
  };

  const openProductDetail = (item: ProductItem) => {
    if (item?.id) {
      window.location.href = `/${locale}/products/${item.id}`;
    }
  };

  const displayItems = items || [];

  const categories = Array.from(
    new Set(displayItems.flatMap((item: ProductItem) => (item.category ? [item.category] : [])))
  ) as string[];

  let processedItems = [...displayItems];

  if (searchTerm) {
    processedItems = processedItems.filter((item: ProductItem) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedCategory) {
    processedItems = processedItems.filter((item: ProductItem) => item.category === selectedCategory);
  }

  processedItems = processedItems.filter((item: ProductItem) => {
    const price = item.price || 0;
    return price >= minPrice && price <= maxPrice;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setMinPrice(50000);
    setMaxPrice(5000000);
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Banner Section */}
      <PageBannerSlider banners={banners || []} />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filter Panel */}
          <ProductFilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
            minLimit={0}
            maxLimit={10000000}
            stepPrice={50000}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            hasActiveFilters={Boolean(selectedCategory !== null || minPrice !== 50000 || maxPrice !== 5000000 || searchTerm !== '')}
            onClearFilters={handleClearFilters}
          />

          {/* Right Product Grid Display */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Input Bar */}
            <SearchInput
              value={searchTerm}
              onSearch={setSearchTerm}
              placeholder="Tìm kiếm sản phẩm theo tên..."
            />

            {/* Products Grid Subcomponent */}
            <ProductsGrid
              isLoading={isLoading}
              isError={isError}
              items={processedItems}
              isLoggedIn={isLoggedIn}
              locale={locale}
              onOpenDetail={openProductDetail}
              onAddToCart={handleAddToCartOnly}
              onQuickPurchase={setQuickPurchaseProduct}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      </div>

      {/* Product Detail & Multi-Image Gallery Modal */}
      <ProductDetailModal
        selectedDetailProduct={selectedDetailProduct}
        activeImageIdx={activeImageIdx}
        setActiveImageIdx={setActiveImageIdx}
        onClose={() => setSelectedDetailProduct(null)}
        onBuyItem={handleBuyItem}
      />

      {/* Quick Purchase Modal for Store Products */}
      {quickPurchaseProduct && (
        <QuickPurchaseModal
          item={quickPurchaseProduct}
          mode="product"
          locale={locale}
          isLoggedIn={isLoggedIn}
          onClose={() => setQuickPurchaseProduct(null)}
          onSuccessPayment={(orderData: { code?: string; id?: string }) => {
            setQuickPurchaseProduct(null);
            const orderCode = orderData?.code || orderData?.id;
            if (orderCode) {
              window.location.href = `/api/proxy/public/payment/sepay/pay/${orderCode}`;
            }
          }}
        />
      )}
    </div>
  );
};
