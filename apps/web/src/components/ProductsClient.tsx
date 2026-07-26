'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useCatalogShopItems } from '@/hooks/queries/useCatalog';
import { useBanner } from '@/hooks/queries/useBanner';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { addToCart } from '@/utils/cart';
import { QuickPurchaseModal } from '@/components/QuickPurchaseModal';
import { SepayPaymentModal } from '@/components/SepayPaymentModal';
import { getProductImage } from '@/utils/productUtils';
import { ProductImageCollage } from './products/ProductImageCollage';
import { ProductsFilterSidebar } from './products/ProductsFilterSidebar';
import { ProductsDetailModal } from './products/ProductsDetailModal';

type ProductsClientProps = {
  locale: string;
  initialItems?: any[];
  isLoggedIn?: boolean;
};

export const ProductsClient = ({ locale, initialItems, isLoggedIn }: ProductsClientProps) => {
  const t = useTranslations('products');
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

  // Get distinct categories
  const categories = Array.from(
    new Set(displayItems.flatMap((item: any) => item.category ? [item.category] : []))
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
          <ProductsFilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            searchTerm={searchTerm}
            onClearFilters={handleClearFilters}
          />

          {/* Right Product Grid Display */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search Input Bar */}
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchPlaceholder') || 'Tìm kiếm sản phẩm...'}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-[#1C3F24] bg-white shadow-xs"
              />
              <div className="absolute left-3.5 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white border border-gray-200 rounded-2xl overflow-hidden p-5 space-y-4 animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-xl"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center font-medium">
                Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.
              </div>
            ) : processedItems.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 font-medium space-y-3">
                <p className="text-base font-bold text-gray-800">Không tìm thấy sản phẩm phù hợp</p>
                <p className="text-xs">Hãy thử thay đổi từ khóa hoặc chọn danh mục khác.</p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-block bg-[#1C3F24] text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedItems.map((item: any) => {
                  const hasMultiImages = item?.images && Array.isArray(item.images) && item.images.length > 1;

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between group"
                    >
                      {/* Product Image Panel */}
                      <button 
                        type="button"
                        onClick={() => openProductDetail(item)}
                        className="relative w-full h-64 bg-gray-50 flex items-center justify-center p-4 cursor-pointer text-left border-0"
                      >
                        {/* Category Badge */}
                        {item.category && (
                          <span className="absolute top-3 left-3 bg-[#1C3F24]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
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
                            <span>{item.images.length} ảnh</span>
                          </span>
                        )}

                        <ProductImageCollage item={item} />
                      </button>

                      {/* Details Panel */}
                      <div className="p-5 space-y-4">
                        <div className="space-y-2.5">
                          <button 
                            type="button"
                            onClick={() => openProductDetail(item)}
                            className="font-extrabold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[40px] uppercase group-hover:text-[#1C3F24] transition-colors cursor-pointer text-left block w-full border-0"
                          >
                            {item.name}
                          </button>
                        </div>

                        <div className="text-secondary font-extrabold text-base pt-1">
                          {item.price.toLocaleString('vi-VN')} đ
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleAddToCartOnly(e, item)}
                            className="p-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                            title="Thêm vào giỏ hàng"
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
                            setQuickPurchaseProduct(item);
                          }}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-[#1C3F24] hover:bg-[#1C3F24]/90 text-white py-2.5 rounded-lg font-extrabold transition-colors duration-200 text-xs active:scale-98 shadow-xs cursor-pointer"
                          >
                            Mua ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

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
            qrUrl: `https://qr.sepay.vn/img?acc=104875953046&bank=VietinBank&amount=${paymentOrder.totalAmount}&des=${paymentOrder.code}`,
            accountNumber: '104875953046',
            accountName: 'CONG TY CP SAM NGOC LINH',
            bankBrand: 'VietinBank (Ngân hàng TMCP Công Thương Việt Nam)',
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
