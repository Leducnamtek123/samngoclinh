'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
import type { GinsengPlantItem, CultivationBed } from '@/types';

type GinsengClientProps = {
  locale: string;
  initialItems?: GinsengPlantItem[];
  isLoggedIn?: boolean;
};

export const GinsengClient = ({ locale, initialItems, isLoggedIn }: GinsengClientProps) => {
  const tTrees = useTranslations('trees');
  const tProducts = useTranslations('products');
  const tActions = useTranslations('actions');

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: items, isLoading, isError } = useCatalogPlants(initialItems);
  const { data: banners } = useBanner('ginseng');

  // Initialize state from URL search params if present
  const initialQ = searchParams.get('q') || '';
  const initialAgeParam = searchParams.get('age');
  const initialAges = initialAgeParam
    ? initialAgeParam.split(',').map((v) => Number(v.trim())).filter(Boolean)
    : [];
  const initialMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 50000;
  const initialMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 1000000;
  const initialView = searchParams.get('view') === 'beds' ? 'beds' : 'catalog';

  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [selectedAges, setSelectedAges] = useState<number[]>(initialAges);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [viewMode, setViewMode] = useState<'catalog' | 'beds'>(initialView);

  const { data: publicBeds } = usePublicCultivationBeds(selectedAges.length === 1 ? selectedAges[0] : undefined);

  const [selectedDetailProduct, setSelectedDetailProduct] = useState<GinsengPlantItem | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quickPurchasePlant, setQuickPurchasePlant] = useState<GinsengPlantItem | null>(null);

  // Sync state changes back to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (selectedAges.length > 0) params.set('age', selectedAges.join(','));
    if (minPrice !== 50000) params.set('minPrice', String(minPrice));
    if (maxPrice !== 1000000) params.set('maxPrice', String(maxPrice));
    if (viewMode !== 'catalog') params.set('view', viewMode);

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    if (typeof window !== 'undefined' && window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [searchTerm, selectedAges, minPrice, maxPrice, viewMode, pathname]);

  const handleAddToCartOnly = (e: React.MouseEvent, item: GinsengPlantItem) => {
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
    toast.success(`${tProducts('addedToCart')} "${item.name}"`);
  };

  const handleBuyItem = (e: React.MouseEvent, item: GinsengPlantItem) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=ginseng`;
      return;
    }
    setSelectedDetailProduct(null);
    setQuickPurchasePlant(item);
  };

  const openProductDetail = (item: GinsengPlantItem) => {
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
    processedItems = processedItems.filter((item: GinsengPlantItem) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedAges.length > 0) {
    processedItems = processedItems.filter((item: GinsengPlantItem) => {
      const age = item.ageYear || item.ageYears || 1;
      return selectedAges.some((selectedAge) => (selectedAge === 3 ? age >= 3 : age === selectedAge));
    });
  }

  processedItems = processedItems.filter((item: GinsengPlantItem) => {
    const price = item.price || 0;
    return price >= minPrice && price <= maxPrice;
  });

  const displayBeds = Array.isArray(publicBeds) ? publicBeds : [];
  let processedBeds = [...displayBeds];

  if (searchTerm) {
    processedBeds = processedBeds.filter(
      (bed: CultivationBed) =>
        (bed.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bed.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bed.gardenCode || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedAges.length > 0) {
    processedBeds = processedBeds.filter((bed: CultivationBed) => {
      const age = (bed as { ageYear?: number }).ageYear || 1;
      return selectedAges.some((selectedAge) => (selectedAge === 3 ? age >= 3 : age === selectedAge));
    });
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      <PageBannerSlider banners={banners || []} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
          <ProductFilterSidebar
            title={tProducts('filterTitle')}
            ageOptions={[
              { label: `1 ${tTrees('yearsOld')}`, value: 1, id: 'age-1' },
              { label: `2 ${tTrees('yearsOld')}`, value: 2, id: 'age-2' },
              { label: `3+ ${tTrees('yearsOld')}`, value: 3, id: 'age-3' },
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
                placeholder={tProducts('searchPlaceholder')}
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
                  <span>{tTrees('treeInfo')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('beds')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-[color,background-color,box-shadow] flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'beds' ? 'bg-white text-primary shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{tTrees('cultivationBed')}</span>
                </button>
              </div>
            </div>

            {viewMode === 'beds' ? (
              <GinsengBedsGrid beds={processedBeds} />
            ) : isLoading ? (
              <LoadingState message={tProducts('loading')} size="lg" />
            ) : isError ? (
              <ErrorState message={tProducts('error')} onRetry={handleClearFilters} />
            ) : processedItems.length === 0 ? (
              <EmptyState
                title={tProducts('noProductsFound')}
                description={tProducts('noProductsDesc')}
                actionLabel={tActions('clearFilters')}
                onAction={handleClearFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedItems.map((item: GinsengPlantItem) => (
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
          onSuccessPayment={(orderData: { code?: string; id?: string }) => {
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
