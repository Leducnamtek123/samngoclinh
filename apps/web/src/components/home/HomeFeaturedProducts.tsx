'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Link } from '@/lib/I18nNavigation';
import { ScrollReveal, StaggerContainer } from '@/components/animation';
import { formatVNDPrice } from '@/utils/formatters';
import { addToCart } from '@/utils/cart';
import { QuickPurchaseModal, type QuickPurchaseItem } from '@/components/purchase/QuickPurchaseModal';
import type { GinsengPlantItem, ProductItem } from '@/types';

type TabType = 'all' | 'plants' | 'wine' | 'products';

interface HomeFeaturedProductsProps {
  locale: string;
  initialPlants?: GinsengPlantItem[];
  initialShopItems?: ProductItem[];
  isLoggedIn?: boolean;
}

export const HomeFeaturedProducts: React.FC<HomeFeaturedProductsProps> = ({
  locale,
  initialPlants = [],
  initialShopItems = [],
  isLoggedIn = false,
}) => {
  const t = useTranslations('homepage');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [quickPurchaseItem, setQuickPurchaseItem] = useState<{
    item: QuickPurchaseItem;
    mode: 'plant' | 'product';
  } | null>(null);

  // Normalize items for display
  const plants = useMemo(() => {
    return initialPlants.map((item) => ({
      ...item,
      categoryType: 'plant' as const,
      displayCategory: 'Cây giống',
      ageYear: item.ageYear || item.ageYears || 1,
      stock: item.stock ?? 10,
      image: item.image || item.imageUrl || (item.images && item.images[0]) || '/images/default_plant.png',
    }));
  }, [initialPlants]);

  const shopItems = useMemo(() => {
    return initialShopItems.map((item) => {
      const isWine = item.name?.toLowerCase().includes('rượu') || item.category?.toLowerCase().includes('rượu') || item.category === 'wine';
      return {
        ...item,
        categoryType: isWine ? ('wine' as const) : ('product' as const),
        displayCategory: isWine ? 'Rượu sâm' : (item.category || 'Chế phẩm sâm'),
        ageYear: item.ageYear || item.ageYears || 5,
        stock: item.stock ?? 25,
        image: item.image || item.imageUrl || (item.images && item.images[0]) || '/images/default_product.png',
      };
    });
  }, [initialShopItems]);

  const filteredItems = useMemo(() => {
    if (activeTab === 'plants') return plants;
    if (activeTab === 'wine') return shopItems.filter((i) => i.categoryType === 'wine');
    if (activeTab === 'products') return shopItems.filter((i) => i.categoryType === 'product');
    
    // 'all' -> Interleave plants & shop items (up to 8 items)
    const combined = [...plants, ...shopItems];
    return combined.slice(0, 8);
  }, [activeTab, plants, shopItems]);

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=cart`;
      return;
    }
    addToCart({
      id: item.id || `PROD-${item.name}`,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.displayCategory,
    });
    toast.success(t('addedToCart', { name: item.name }));
  };

  const handleBuyNow = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=quick_buy`;
      return;
    }
    setQuickPurchaseItem({
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.displayCategory,
        stock: item.stock,
        ageYear: item.ageYear,
      },
      mode: item.categoryType === 'plant' ? 'plant' : 'product',
    });
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FBFDFB] border-b border-gray-100 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title & Subtitle */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              {t('featuredProductsBadge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary leading-tight font-display-lg">
              {t('featuredProductsTitle')}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
              {t('featuredProductsDesc')}
            </p>
          </div>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal variant="fade-up" delay={0.1}>
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
            {[
              { key: 'all', label: t('tabAll') },
              { key: 'plants', label: t('tabPlants') },
              { key: 'wine', label: t('tabWine') },
              { key: 'products', label: t('tabProducts') },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-emerald-900/10 scale-105'
                      : 'bg-white text-gray-600 hover:bg-emerald-50/60 hover:text-primary border border-gray-200/80 shadow-2xs'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Products Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-xs max-w-xl mx-auto">
            <p className="text-gray-400 text-sm font-medium">Hiện chưa có sản phẩm trong danh mục này.</p>
          </div>
        ) : (
          <StaggerContainer
            variant="fade-up"
            stagger={0.08}
            distance={30}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
              >
                {/* Image Section */}
                <div className="relative aspect-square w-full bg-gray-50/80 overflow-hidden flex items-center justify-center p-4">
                  {/* Origin Badge */}
                  <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-xs text-emerald-800 border border-emerald-100 text-[10px] font-black px-2.5 py-1 rounded-full z-10 shadow-2xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {t('originKonTum')}
                  </span>

                  {/* Category Tag */}
                  <span className="absolute top-3.5 right-3.5 bg-emerald-950/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10">
                    {item.displayCategory}
                  </span>

                  <Link href={`/products/${item.id}`} className="w-full h-full relative block">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-2 group-hover:scale-108 transition-transform duration-500"
                      unoptimized
                    />
                  </Link>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Meta info tags */}
                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold bg-gray-50/80 px-2.5 py-1 rounded-lg border border-gray-100">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t('ageYear', { year: item.ageYear })}
                      </span>
                      <span>{t('stock', { count: item.stock })}</span>
                    </div>

                    {/* Product Name */}
                    <Link href={`/products/${item.id}`} className="block">
                      <h3 className="font-extrabold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[38px] group-hover:text-secondary transition-colors cursor-pointer">
                        {item.name}
                      </h3>
                    </Link>
                  </div>

                  {/* Price and Actions */}
                  <div className="space-y-3 pt-2 border-t border-gray-50">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base sm:text-lg font-black text-primary tracking-tight">
                        {formatVNDPrice(item.price)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, item)}
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors border border-emerald-200/50 cursor-pointer active:scale-95"
                        title={t('addToCart')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <span>{t('addToCart')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, item)}
                        className="w-full inline-flex items-center justify-center gap-1 bg-secondary hover:bg-secondary-hover text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
                      >
                        <span>{t('buyNow')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        )}

        {/* View All Products Button */}
        <ScrollReveal variant="scale" delay={0.2} className="text-center mt-12 sm:mt-14">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:border-secondary hover:text-secondary text-primary px-8 py-3.5 rounded-full text-sm font-bold shadow-xs hover:shadow-md transition-all duration-300 group"
          >
            <span>{t('viewAllProducts')}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </ScrollReveal>
      </div>

      {/* Quick Purchase Modal */}
      {quickPurchaseItem && (
        <QuickPurchaseModal
          item={quickPurchaseItem.item}
          mode={quickPurchaseItem.mode}
          locale={locale}
          isLoggedIn={isLoggedIn}
          onClose={() => setQuickPurchaseItem(null)}
        />
      )}
    </section>
  );
};
