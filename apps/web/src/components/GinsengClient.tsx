'use client';

import { Sprout, LayoutGrid } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { SearchInput } from '@/components/common/SearchInput';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { ProductFilterSidebar } from '@/components/products/ProductFilterSidebar';
import { QuickPurchaseModal } from '@/components/purchase/QuickPurchaseModal';
import { useBanner } from '@/hooks/queries/useBanner';
import { useCatalogPlants } from '@/hooks/queries/useCatalog';
import { usePublicCultivationBeds } from '@/hooks/queries/useCultivation';
import type { GinsengPlantItem, CultivationBed } from '@/types';
import { addToCart } from '@/utils/cart';
import { GinsengBedsGrid } from './ginseng/GinsengBedsGrid';
import { GinsengProductCard } from './ginseng/GinsengProductCard';
import { ProductDetailModal } from './products/ProductDetailModal';

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
    ? initialAgeParam
        .split(',')
        .map((v) => Number(v.trim()))
        .filter(Boolean)
    : [];
  const initialMinPrice = searchParams.get('minPrice')
    ? Number(searchParams.get('minPrice'))
    : 50_000;
  const initialMaxPrice = searchParams.get('maxPrice')
    ? Number(searchParams.get('maxPrice'))
    : 1_000_000;
  const initialView = searchParams.get('view') === 'beds' ? 'beds' : 'catalog';

  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [selectedAges, setSelectedAges] = useState<number[]>(initialAges);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [viewMode, setViewMode] = useState<'catalog' | 'beds'>(initialView);

  const { data: publicBeds } = usePublicCultivationBeds(
    selectedAges.length === 1 ? selectedAges[0] : undefined,
  );

  const [selectedDetailProduct, setSelectedDetailProduct] = useState<GinsengPlantItem | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quickPurchasePlant, setQuickPurchasePlant] = useState<GinsengPlantItem | null>(null);

  // Sync state changes back to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('q', searchTerm);
    }
    if (selectedAges.length > 0) {
      params.set('age', selectedAges.join(','));
    }
    if (minPrice !== 50_000) {
      params.set('minPrice', String(minPrice));
    }
    if (maxPrice !== 1_000_000) {
      params.set('maxPrice', String(maxPrice));
    }
    if (viewMode !== 'catalog') {
      params.set('view', viewMode);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    if (
      typeof window !== 'undefined' &&
      window.location.pathname + window.location.search !== newUrl
    ) {
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
    if (e && e.preventDefault) {
      e.preventDefault();
    }
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
    setMinPrice(50_000);
    setMaxPrice(1_000_000);
  };

  const displayItems = items || [];
  let processedItems = [...displayItems];

  if (searchTerm) {
    processedItems = processedItems.filter((item: GinsengPlantItem) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  if (selectedAges.length > 0) {
    processedItems = processedItems.filter((item: GinsengPlantItem) => {
      const age = item.ageYear || item.ageYears || 1;
      return selectedAges.some((selectedAge) =>
        selectedAge === 3 ? age >= 3 : age === selectedAge,
      );
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
        (bed.gardenCode || '').toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  if (selectedAges.length > 0) {
    processedBeds = processedBeds.filter((bed: CultivationBed) => {
      const age = (bed as { ageYear?: number }).ageYear || 1;
      return selectedAges.some((selectedAge) =>
        selectedAge === 3 ? age >= 3 : age === selectedAge,
      );
    });
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 pb-16">
      <PageBannerSlider banners={banners ? (Array.isArray(banners) ? banners : [banners]) : []} />

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 pt-4 lg:grid-cols-4">
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
            maxLimit={2_000_000}
            stepPrice={20_000}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            hasActiveFilters={Boolean(
              selectedAges.length > 0 ||
              searchTerm ||
              minPrice !== 50_000 ||
              maxPrice !== 1_000_000,
            )}
            onClearFilters={handleClearFilters}
          />

          <div className="space-y-6 lg:col-span-3">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <SearchInput
                value={searchTerm}
                onSearch={setSearchTerm}
                placeholder={tProducts('searchPlaceholder')}
              />

              <div className="flex w-full shrink-0 rounded-xl bg-gray-200/80 p-1 sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('catalog');
                  }}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-[color,background-color,box-shadow] ${
                    viewMode === 'catalog'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sprout className="h-3.5 w-3.5 text-emerald-700" />
                  <span>{tTrees('treeInfo')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('beds');
                  }}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-[color,background-color,box-shadow] ${
                    viewMode === 'beds'
                      ? 'bg-white text-primary shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5 text-emerald-700" />
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        onClose={() => {
          setSelectedDetailProduct(null);
        }}
        onBuyItem={(e, item) => {
          if (item) {
            handleBuyItem(e || ({} as React.MouseEvent), item as GinsengPlantItem);
          }
        }}
      />

      {quickPurchasePlant && (
        <QuickPurchaseModal
          item={quickPurchasePlant}
          mode="plant"
          locale={locale}
          isLoggedIn={isLoggedIn}
          onClose={() => {
            setQuickPurchasePlant(null);
          }}
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
