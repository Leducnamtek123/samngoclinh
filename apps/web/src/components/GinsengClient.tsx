'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useCatalogPlants } from '@/hooks/queries/useCatalog';
import { useBanner } from '@/hooks/queries/useBanner';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { addToCart } from '@/utils/cart';
import { QuickPurchaseModal } from '@/components/QuickPurchaseModal';
import { SepayPaymentModal } from '@/components/SepayPaymentModal';
import { GinsengFilterSidebar } from './ginseng/GinsengFilterSidebar';
import { GinsengProductCard } from './ginseng/GinsengProductCard';
import { GinsengDetailModal } from './ginseng/GinsengDetailModal';

type GinsengClientProps = {
  locale: string;
  initialItems?: any[];
  isLoggedIn?: boolean;
};

export const GinsengClient = ({ locale, initialItems, isLoggedIn }: GinsengClientProps) => {
  const { data: items, isLoading, isError } = useCatalogPlants(initialItems);
  const { data: banners } = useBanner('ginseng');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAges, setSelectedAges] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(1000000);

  const [selectedDetailProduct, setSelectedDetailProduct] = useState<any | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quickPurchasePlant, setQuickPurchasePlant] = useState<any | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<any | null>(null);

  const handleAddToCartOnly = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=cart`;
      return;
    }
    addToCart({
      id: item.id || `GINSENG-${item.name}`,
      name: item.name,
      price: item.price,
      image: item.image || item.images?.[0] || item.imageUrl || '',
      category: 'Cây giống',
    });
    toast.success(`Đã thêm "${item.name}" vào giỏ hàng!`);
  };

  const handleBuyItem = (e: React.MouseEvent, item: any, redirect = true) => {
    if (!isLoggedIn) {
      e.preventDefault();
      window.location.href = `/${locale}/sign-in?reason=ginseng`;
      return;
    }
    e.preventDefault();
    addToCart({
      id: item.id || `GINSENG-${item.name}`,
      name: item.name,
      price: item.price,
      image: item.image || item.images?.[0] || item.imageUrl || '/assets/images/logo_ruou_sam.png',
      category: 'Ginseng',
    });

    if (redirect) {
      window.location.href = `/${locale}/cart`;
    }
  };

  const openProductDetail = (item: any) => {
    setSelectedDetailProduct(item);
    setActiveImageIdx(0);
  };

  const handleAgeToggle = (age: number) => {
    if (selectedAges.includes(age)) {
      setSelectedAges(selectedAges.filter(a => a !== age));
    } else {
      setSelectedAges([...selectedAges, age]);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedAges([]);
    setMinPrice(50000);
    setMaxPrice(1000000);
  };

  const displayItems = items || [];
  let processedItems = [...displayItems];

  if (searchTerm) {
    processedItems = processedItems.filter((item: any) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedAges.length > 0) {
    processedItems = processedItems.filter((item: any) => {
      const age = item.ageYear || 1;
      return selectedAges.some(selectedAge => (selectedAge === 3 ? age >= 3 : age === selectedAge));
    });
  }

  processedItems = processedItems.filter((item: any) => {
    const price = item.price || 0;
    return price >= minPrice && price <= maxPrice;
  });

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      <PageBannerSlider banners={banners || []} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <GinsengFilterSidebar
            selectedAges={selectedAges}
            searchTerm={searchTerm}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onAgeToggle={handleAgeToggle}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onClearFilters={handleClearFilters}
          />

          <div className="lg:col-span-3 space-y-6">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sản phẩm sâm giống..."
                aria-label="Tìm kiếm sản phẩm sâm giống"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-[#1C3F24] bg-white shadow-xs"
              />
              <div className="absolute left-3.5 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

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
                Không thể tải danh sách sản phẩm sâm. Vui lòng thử lại sau.
              </div>
            ) : processedItems.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 font-medium space-y-3">
                <p className="text-base font-bold text-gray-800">Không tìm thấy sản phẩm sâm phù hợp</p>
                <button type="button" onClick={handleClearFilters} className="inline-block bg-[#1C3F24] text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedItems.map((item: any) => (
                  <GinsengProductCard
                    key={item.id}
                    item={item}
                    onOpenDetail={openProductDetail}
                    onAddToCart={handleAddToCartOnly}
                    onQuickPurchase={(item) => {
                      if (!isLoggedIn) {
                        window.location.href = `/${locale}/sign-in?reason=ginseng`;
                        return;
                      }
                      setQuickPurchasePlant(item);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <GinsengDetailModal
        selectedDetailProduct={selectedDetailProduct}
        activeImageIdx={activeImageIdx}
        setActiveImageIdx={setActiveImageIdx}
        onClose={() => setSelectedDetailProduct(null)}
        onBuyItem={handleBuyItem}
      />

      {quickPurchasePlant && (
        <QuickPurchaseModal
          item={quickPurchasePlant}
          mode="plant"
          locale={locale}
          isLoggedIn={isLoggedIn}
          onClose={() => setQuickPurchasePlant(null)}
          onSuccessPayment={(orderData) => {
            setQuickPurchasePlant(null);
            setPaymentOrder(orderData);
          }}
        />
      )}

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
