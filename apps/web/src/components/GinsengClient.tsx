'use client';

import { useState } from 'react';
import { Sprout, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';
import { useCatalogPlants } from '@/hooks/queries/useCatalog';
import { usePublicCultivationBeds } from '@/hooks/queries/useCultivation';
import { useBanner } from '@/hooks/queries/useBanner';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { addToCart } from '@/utils/cart';
import { QuickPurchaseModal } from '@/components/purchase/QuickPurchaseModal';
import { ProductFilterSidebar } from '@/components/products/ProductFilterSidebar';
import { GinsengProductCard } from './ginseng/GinsengProductCard';
import { ProductDetailModal } from './products/ProductDetailModal';
import { GinsengBedsGrid } from './ginseng/GinsengBedsGrid';
import { SearchInput } from '@/components/common/SearchInput';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
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

  const handleBuyItem = (e: React.MouseEvent, item: any) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=ginseng`;
      return;
    }
    setSelectedDetailProduct(null);
    setQuickPurchasePlant(item);
  };

  const openProductDetail = (item: any) => {
    if (item?.id) {
      window.location.href = `/${locale}/ginseng/${item.id}`;
    }
  };

  const handleAgeToggle = (age: number) => {
    if (selectedAges.includes(age)) {
      setSelectedAges(selectedAges.filter((a) => a !== age));
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
      return selectedAges.some((selectedAge) => (selectedAge === 3 ? age >= 3 : age === selectedAge));
    });
  }

  processedItems = processedItems.filter((item: any) => {
    const price = item.price || 0;
    return price >= minPrice && price <= maxPrice;
  });

  const displayBeds = Array.isArray(publicBeds) ? publicBeds : [];
  let processedBeds = [...displayBeds];

  if (searchTerm) {
    processedBeds = processedBeds.filter(
      (bed: any) =>
        (bed.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bed.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bed.gardenName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedAges.length > 0) {
    processedBeds = processedBeds.filter((bed: any) => {
      const age = bed.ageYear || 1;
      return selectedAges.some((selectedAge) => (selectedAge === 3 ? age >= 3 : age === selectedAge));
    });
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      <PageBannerSlider banners={banners || []} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
          <ProductFilterSidebar
            title="Bộ Lọc Sâm"
            ageOptions={[
              { label: '1 Năm Tuổi', value: 1, id: 'age-1' },
              { label: '2 Năm Tuổi', value: 2, id: 'age-2' },
              { label: 'Từ 3 Năm Tuổi+', value: 3, id: 'age-3' },
            ]}
            selectedAges={selectedAges}
            onAgeToggle={handleAgeToggle}
            minPrice={minPrice}
            maxPrice={maxPrice}
            minLimit={0}
            maxLimit={2000000}
            stepPrice={20000}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            hasActiveFilters={Boolean(selectedAges.length > 0 || searchTerm || minPrice !== 50000 || maxPrice !== 1000000)}
            onClearFilters={handleClearFilters}
          />

          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <SearchInput
                value={searchTerm}
                onSearch={setSearchTerm}
                placeholder="Tìm kiếm sâm giống..."
              />

              <div className="flex bg-gray-200/80 p-1 rounded-xl w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('catalog')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-[color,background-color,box-shadow] flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'catalog' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Danh mục sâm</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('beds')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-[color,background-color,box-shadow] flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'beds' ? 'bg-white text-primary shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Vườn luống Farm</span>
                </button>
              </div>
            </div>

            {viewMode === 'beds' ? (
              <GinsengBedsGrid beds={processedBeds} />
            ) : isLoading ? (
              <LoadingState message="Đang tải danh sách sâm giống..." size="lg" />
            ) : isError ? (
              <ErrorState message="Không thể tải danh sách sâm. Vui lòng thử lại sau." onRetry={handleClearFilters} />
            ) : processedItems.length === 0 ? (
              <EmptyState
                title="Không tìm thấy sâm phù hợp"
                description="Hãy thử thay đổi độ tuổi hoặc giá trị tìm kiếm."
                actionLabel="Đặt lại bộ lọc"
                onAction={handleClearFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedItems.map((item: any) => (
                  <GinsengProductCard
                    key={item.id}
                    item={item}
                    onOpenDetail={openProductDetail}
                    onAddToCart={handleAddToCartOnly}
                    onQuickPurchase={(itemToBuy) => {
                      if (!isLoggedIn) {
                        window.location.href = `/${locale}/sign-in?reason=ginseng`;
                        return;
                      }
                      setQuickPurchasePlant(itemToBuy);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductDetailModal
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
          onSuccessPayment={(orderData: any) => {
            setQuickPurchasePlant(null);
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
