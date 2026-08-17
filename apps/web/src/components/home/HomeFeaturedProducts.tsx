'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { ScrollReveal, StaggerContainer } from '@/components/animation';
import { QuickPurchaseModal } from '@/components/purchase/QuickPurchaseModal';
import type { QuickPurchaseItem } from '@/components/purchase/QuickPurchaseModal';
import { Link } from '@/lib/I18nNavigation';
import type { GinsengPlantItem, ProductItem } from '@/types';
import { addToCart } from '@/utils/cart';
import { formatVNDPrice } from '@/utils/formatters';

type TabType = 'all' | 'plants' | 'wine' | 'products';

type HomeFeaturedProductsProps = {
  locale: string;
  initialPlants?: GinsengPlantItem[];
  initialShopItems?: ProductItem[];
  isLoggedIn?: boolean;
};

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
  const plants = initialPlants.map((item) => ({
    ...item,
    categoryType: 'plant' as const,
    displayCategory: 'Cây giống',
    ageYear: item.ageYear || item.ageYears || 1,
    stock: item.stock ?? 10,
    image:
      item.image || item.imageUrl || (item.images && item.images[0]) || '/images/default_plant.png',
  }));

  const shopItems = initialShopItems.map((item) => {
    const isWine =
      item.name?.toLowerCase().includes('rượu') ||
      item.category?.toLowerCase().includes('rượu') ||
      item.category === 'wine';
    return {
      ...item,
      categoryType: isWine ? ('wine' as const) : ('product' as const),
      displayCategory: isWine ? 'Rượu sâm' : item.category || 'Chế phẩm sâm',
      ageYear: item.ageYear || item.ageYears || 5,
      stock: item.stock ?? 25,
      image:
        item.image ||
        item.imageUrl ||
        (item.images && item.images[0]) ||
        '/images/default_product.png',
    };
  });

  const filteredItems = (() => {
    if (activeTab === 'plants') {
      return plants;
    }
    if (activeTab === 'wine') {
      return shopItems.filter((i) => i.categoryType === 'wine');
    }
    if (activeTab === 'products') {
      return shopItems.filter((i) => i.categoryType === 'product');
    }

    // 'all' -> Interleave plants & shop items (up to 8 items)
    const combined = [...plants, ...shopItems];
    return combined.slice(0, 8);
  })();

  type DisplayProduct = (typeof plants)[number] | (typeof shopItems)[number];

  const handleAddToCart = (e: React.MouseEvent, item: DisplayProduct) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      window.location.assign(`/${locale}/sign-in?reason=cart`);
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open_mini_cart'));
    }
  };

  const handleBuyNow = (e: React.MouseEvent, item: DisplayProduct) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      window.location.assign(`/${locale}/sign-in?reason=quick_buy`);
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
    <section className="relative overflow-hidden border-b border-gray-100 bg-[#FBFDFB] py-16 sm:py-20">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/30 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title & Category Controls (Asymmetric Editorial Split) */}
        <ScrollReveal variant="fade-up">
          <div className="mb-10 flex flex-col justify-between gap-6 border-b border-emerald-950/5 pb-8 sm:mb-12 lg:flex-row lg:items-end">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/90 px-3.5 py-1.5 text-xs font-black tracking-widest text-emerald-900 uppercase shadow-2xs">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
                <span>{t('featuredProductsBadge')}</span>
              </div>
              <h2 className="font-display text-3xl leading-tight font-extrabold tracking-tight text-primary sm:text-4xl lg:text-[40px]">
                {t('featuredProductsTitle')}
              </h2>
              <p className="text-sm leading-relaxed font-normal text-gray-600 sm:text-base">
                {t('featuredProductsDesc')}
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex shrink-0 flex-wrap items-center gap-2 self-start rounded-2xl border border-gray-200/80 bg-white p-1.5 shadow-xs sm:flex-nowrap lg:self-end">
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
                    onClick={() => {
                      setActiveTab(tab.key as TabType);
                    }}
                    className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-[color,background-color,box-shadow] duration-200 sm:text-sm ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Products Grid */}
        {filteredItems.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-gray-100 bg-white py-16 text-center shadow-xs">
            <p className="text-sm font-medium text-gray-400">{t('emptyProducts')}</p>
          </div>
        ) : (
          <StaggerContainer
            variant="fade-up"
            stagger={0.08}
            distance={30}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image Section */}
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gray-50/80 p-4">
                  {/* Origin Badge */}
                  <span className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1 rounded-full border border-emerald-100 bg-white/95 px-2.5 py-1 text-[10px] font-black text-emerald-800 shadow-2xs backdrop-blur-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    {t('originKonTum')}
                  </span>

                  {/* Category Tag */}
                  <span className="absolute top-3.5 right-3.5 z-10 rounded-md bg-emerald-950/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                    {item.displayCategory}
                  </span>

                  <Link href={`/products/${item.id}`} className="relative block h-full w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-108"
                      unoptimized
                    />
                  </Link>
                </div>

                {/* Details Section */}
                <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
                  <div className="space-y-2">
                    {/* Meta info tags */}
                    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/80 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {t('ageYear', { year: item.ageYear })}
                      </span>
                      <span>{t('stock', { count: item.stock })}</span>
                    </div>

                    {/* Product Name */}
                    <Link href={`/products/${item.id}`} className="block">
                      <h3 className="line-clamp-2 min-h-[38px] cursor-pointer text-sm leading-snug font-extrabold text-gray-900 transition-colors group-hover:text-secondary">
                        {item.name}
                      </h3>
                    </Link>
                  </div>

                  {/* Price and Actions */}
                  <div className="space-y-3 border-t border-gray-50 pt-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-black tracking-tight text-primary sm:text-lg">
                        {formatVNDPrice(item.price)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          handleAddToCart(e, item);
                        }}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-emerald-200/50 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100/80 active:scale-95"
                        title={t('addToCart')}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-3.5 w-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                          />
                        </svg>
                        <span>{t('addToCart')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          handleBuyNow(e, item);
                        }}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-white shadow-xs transition-[box-shadow,transform,background-color] hover:bg-secondary-hover hover:shadow-md active:scale-95"
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
        <ScrollReveal variant="scale" delay={0.2} className="mt-12 text-center sm:mt-14">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-3.5 text-sm font-bold text-primary shadow-xs transition-[border-color,color,box-shadow] duration-300 hover:border-secondary hover:text-secondary hover:shadow-md"
          >
            <span>{t('viewAllProducts')}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
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
          onClose={() => {
            setQuickPurchaseItem(null);
          }}
        />
      )}
    </section>
  );
};
