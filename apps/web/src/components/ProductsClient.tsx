'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useCatalogShopItems } from '@/hooks/queries/useCatalog';
import { useBanner } from '@/hooks/queries/useBanner';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { addToCart } from '@/utils/cart';
import { QuickPurchaseModal } from '@/components/purchase/QuickPurchaseModal';
import { SepayPaymentModal } from '@/components/payment/SepayPaymentModal';
import { getProductImage } from '@/utils/productUtils';
import { ProductFilterSidebar } from './products/ProductFilterSidebar';
import { ProductsDetailModal } from './products/ProductsDetailModal';
import { ProductsGrid } from './products/ProductsGrid';
import { SearchInput } from '@/components/common/SearchInput';

type ProductsClientProps = {
  locale: string;
  initialItems?: any[];
  isLoggedIn?: boolean;
};

export const ProductsClient = ({ locale, initialItems, isLoggedIn }: ProductsClientProps) => {
  const { data: items, isLoading, isError } = useCatalogShopItems(initialItems);
  const { data: banners } = useBanner('products');
  const [searchTerm, setSearchTerm] = useState('');

  // Multi-image detail modal state
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<any | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quickPurchaseProduct, setQuickPurchaseProduct] = useState<any | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<any | null>(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number>(50000);
  const [maxPrice, setMaxPrice] = useState<number>(5000000);

  const handleAddToCartOnly = (e: React.MouseEvent, item: any) => {
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
  };

  const handleBuyItem = (e: React.MouseEvent, item: any, redirect = true) => {
    if (!isLoggedIn) {
      e.preventDefault();
      window.location.href = `/${locale}/sign-in?reason=products`;
      return;
    }
    e.preventDefault();
    if (!item?.id) return;
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: getProductImage(item, 0) || '/assets/images/logo_ruou_sam.png',
      category: item.category || 'Sản phẩm',
    });

    if (redirect) {
      window.location.href = `/${locale}/cart`;
    }
  };

  const openProductDetail = (item: any) => {
    setSelectedDetailProduct(item);
    setActiveImageIdx(0);
  };

  const displayItems = items || [];

  const categories = Array.from(
    new Set(displayItems.flatMap((item: any) => (item.category ? [item.category] : [])))
  ) as string[];

  let processedItems = [...displayItems];

  if (searchTerm) {
    processedItems = processedItems.filter((item: any) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedCategory) {
    processedItems = processedItems.filter((item: any) => item.category === selectedCategory);
  }

  processedItems = processedItems.filter((item: any) => {
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
      <ProductsDetailModal
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
          onSuccessPayment={(orderData) => {
            setQuickPurchaseProduct(null);
            setPaymentOrder(orderData);
          }}
        />
      )}

      {/* Sepay VietQR Payment Modal for Instant QR Scanning */}
      {paymentOrder && (
        <SepayPaymentModal
          isOpen={!!paymentOrder}
          onClose={() => setPaymentOrder(null)}
          paymentInfo={{
            qrUrl: '',
            accountNumber: '',
            accountName: '',
            bankBrand: '',
            amount: paymentOrder.totalAmount,
            orderCode: paymentOrder.code,
          }}
          onPaymentSuccess={() => {
            toast.success('Thanh toán đơn hàng thành công!');
            setPaymentOrder(null);
          }}
        />
      )}
    </div>
  );
};
