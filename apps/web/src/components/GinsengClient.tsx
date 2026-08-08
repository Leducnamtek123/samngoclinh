'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useCatalogPlants } from '@/hooks/queries/useCatalog';
import { usePublicCultivationBeds } from '@/hooks/queries/useCultivation';
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

  const [viewMode, setViewMode] = useState<'catalog' | 'beds'>('catalog');
  const { data: publicBeds } = usePublicCultivationBeds(selectedAges.length === 1 ? selectedAges[0] : undefined);

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

  const displayBeds = Array.isArray(publicBeds) ? publicBeds : [];
  let processedBeds = [...displayBeds];

  if (searchTerm) {
    processedBeds = processedBeds.filter((bed: any) =>
      (bed.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bed.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bed.gardenName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedAges.length > 0) {
    processedBeds = processedBeds.filter((bed: any) => {
      const age = bed.ageYear || 1;
      return selectedAges.some(selectedAge => (selectedAge === 3 ? age >= 3 : age === selectedAge));
    });
  }

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
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-2/3">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Tìm kiếm sản phẩm sâm giống"
                  className="pl-10 h-10 text-sm"
                />
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex bg-gray-200/80 p-1 rounded-xl w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('catalog')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    viewMode === 'catalog' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🌱 Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('beds')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    viewMode === 'beds' ? 'bg-white text-[#1C3F24] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🏞️ Vườn Luống Farm
                </button>
              </div>
            </div>

            {viewMode === 'beds' ? (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-gray-900">Danh sách Luống Canh Tác Sâm Công Khai tại Nông Trại</h3>
                {processedBeds.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500 text-xs">
                    Chưa tìm thấy luống sâm phù hợp với lựa chọn.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {processedBeds.map((bed: any) => (
                      <div key={bed.code || bed.id} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-xs hover:border-[#1C3F24] transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-sm text-[#1C3F24]">Luống #{bed.code}</span>
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                            {bed.ageYear} tuổi
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">📍 {bed.gardenName || bed.gardenLocation || 'Vườn Nam Trà My, Kon Tum'}</p>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>🌱 Số cây sâm: <span className="font-bold text-gray-800">{bed.treeCount || 50} cây</span></p>
                          <p>📅 Ngày trồng: <span className="font-bold text-gray-800">{bed.plantedAt ? new Date(bed.plantedAt).toLocaleDateString('vi-VN') : 'Mới trồng'}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : isLoading ? (
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
