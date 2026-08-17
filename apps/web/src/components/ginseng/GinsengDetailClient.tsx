'use client';

import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCatalogPlant, useCatalogPlants } from '@/hooks/queries/useCatalog';
import { Link } from '@/lib/I18nNavigation';
import type { GinsengPlantItem } from '@/types';
import { addToCart } from '@/utils/cart';
import type { CartItem } from '@/utils/cart';
import { formatVNDPrice } from '@/utils/formatters';

type GinsengDetailClientProps = {
  id: string;
  locale: string;
  isLoggedIn?: boolean;
  initialData?: GinsengPlantItem | null;
};

export const GinsengDetailClient = ({
  id,
  locale,
  isLoggedIn,
  initialData,
}: GinsengDetailClientProps) => {
  const tProd = useTranslations('products');
  const tTrees = useTranslations('trees');
  const tCart = useTranslations('cart');
  const tNav = useTranslations('nav');

  const { data: plant, isLoading, isError } = useCatalogPlant(id, initialData);
  const { data: allPlants } = useCatalogPlants();
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const relatedPlants = Array.isArray(allPlants)
    ? allPlants.filter((item: GinsengPlantItem) => item.id !== id).slice(0, 6)
    : [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse space-y-8 px-4 py-16 sm:px-6">
        <div className="h-6 w-32 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="h-96 rounded-3xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-gray-200" />
            <div className="h-6 w-1/3 rounded bg-gray-200" />
            <div className="h-24 rounded bg-gray-200" />
            <div className="h-12 w-full rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !plant) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{tProd('notFoundTitle')}</h2>
        <p className="text-sm text-gray-500">{tProd('notFoundDesc')}</p>
        <Link
          href={`/${locale}/ginseng`}
          className="inline-block rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-emerald-900"
        >
          {tNav('ginseng')}
        </Link>
      </div>
    );
  }

  const images =
    Array.isArray(plant.images) && plant.images.length > 0
      ? plant.images
      : [plant.image || plant.imageUrl || '/assets/images/logo_ruou_sam.png'];
  const currentImage = images[activeImageIdx] || images[0];

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=ginseng`;
      return;
    }
    addToCart(
      {
        id: plant.id || `GINSENG-${plant.name}`,
        name: plant.name,
        price: plant.price,
        image: currentImage,
        category: 'Cây giống',
      },
      quantity,
    );
    toast.success(tCart('addedToCart', { name: plant.name }));
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=ginseng`;
      return;
    }
    const buyItem: CartItem = {
      id: plant.id || `GINSENG-${plant.name}`,
      name: plant.name,
      price: plant.price,
      image: currentImage,
      category: 'Cây giống',
      quantity,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('checkout_selected_items:v1', JSON.stringify([buyItem]));
    }
    window.location.href = `/${locale}/checkout`;
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link href={`/${locale}`} className="transition-colors hover:text-gray-900">
            {tNav('home')}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/ginseng`} className="transition-colors hover:text-gray-900">
            {tNav('ginseng')}
          </Link>
          <span>/</span>
          <span className="max-w-xs truncate font-bold text-gray-900">{plant.name}</span>
        </nav>

        {/* Details Card */}
        <div className="grid grid-cols-1 gap-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10 md:grid-cols-2">
          {/* Gallery View */}
          <div className="space-y-4">
            <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 sm:h-96">
              <Image
                src={currentImage || '/assets/images/logo_ruou_sam.png'}
                alt={plant.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                className="max-h-full max-w-full rounded-xl object-contain"
              />
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {images.map((imgUrl: string, idx: number) => (
                  <button
                    type="button"
                    key={imgUrl}
                    onClick={() => {
                      setActiveImageIdx(idx);
                    }}
                    className={`relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-[border-color,box-shadow,opacity] ${
                      activeImageIdx === idx
                        ? 'border-primary ring-2 ring-emerald-100'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="64px"
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Plant Info & Care Specs */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold tracking-wider text-emerald-800 uppercase">
                  {plant.ageYears ? `${tTrees('age')}: ${plant.ageYears}` : tProd('featured')}
                </span>
                {plant.origin && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                    <MapPin className="h-3 w-3 shrink-0 text-emerald-600" />
                    <span>{plant.origin}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl leading-snug font-extrabold text-gray-900 sm:text-3xl">
                {plant.name}
              </h1>

              {plant.code && (
                <p className="font-mono text-xs text-gray-400">
                  {tProd('productCode')}:{' '}
                  <span className="font-semibold text-gray-700">{plant.code}</span>
                </p>
              )}

              <div className="text-3xl font-black text-emerald-800">
                {formatVNDPrice(plant.price || 0)}
              </div>

              {/* Plant Specs */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs">
                <div>
                  <span className="block font-medium text-gray-400">{tTrees('age')}:</span>
                  <span className="font-bold text-gray-800">
                    {plant.ageYears ? `${plant.ageYears}` : '—'}
                  </span>
                </div>
                <div>
                  <span className="block font-medium text-gray-400">{tTrees('garden')}:</span>
                  <span className="font-bold text-gray-800">
                    {plant.gardenLocation || 'Nam Trà My, Kon Tum'}
                  </span>
                </div>
                <div>
                  <span className="block font-medium text-gray-400">{tTrees('health')}:</span>
                  <span className="font-bold text-emerald-700">{tTrees('healthy')}</span>
                </div>
                <div>
                  <span className="block font-medium text-gray-400">
                    {tProd('guaranteedQuality')}:
                  </span>
                  <span className="font-bold text-emerald-700">100% DNA Certified</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                  {tProd('description')}
                </h4>
                <p className="text-sm leading-relaxed font-medium text-gray-600">
                  {plant.description || tProd('guaranteedQuality')}
                </p>
              </div>

              {/* Quantity selector */}
              <div className="space-y-2 pt-2">
                <span className="block text-xs font-bold tracking-wider text-gray-400 uppercase">
                  {tProd('quantity')}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center overflow-hidden rounded-xl border border-gray-300 bg-gray-50">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => {
                        setQuantity(Math.max(1, quantity - 1));
                      }}
                      className="cursor-pointer px-3.5 py-2 font-bold text-gray-600 transition-colors hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => {
                        setQuantity(quantity + 1);
                      }}
                      className="cursor-pointer px-3.5 py-2 font-bold text-gray-600 transition-colors hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 cursor-pointer rounded-xl border-2 border-primary px-6 py-3.5 text-center text-xs font-bold text-primary transition-colors hover:bg-emerald-50"
              >
                {tProd('addToCart')}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 cursor-pointer rounded-xl bg-primary px-6 py-3.5 text-center text-xs font-bold text-white shadow-lg transition-colors hover:bg-primary-hover"
              >
                {tProd('buyNow')}
              </button>
            </div>
          </div>
        </div>

        {/* Related Plants Section */}
        {relatedPlants.length > 0 && (
          <div className="space-y-6 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6 sm:p-8">
            <h3 className="text-center text-lg font-extrabold text-gray-900">
              {tProd('relatedProducts')}
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {relatedPlants.map((relPlant: GinsengPlantItem) => {
                const relImg =
                  relPlant.image || relPlant.imageUrl || '/assets/images/logo_ruou_sam.png';
                return (
                  <div
                    key={relPlant.id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs transition-shadow hover:shadow-md"
                  >
                    <Link
                      href={`/${locale}/ginseng/${relPlant.id}`}
                      className="relative block h-48 w-full bg-gray-50 p-4"
                    >
                      <Image
                        src={relImg}
                        alt={relPlant.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-4"
                        unoptimized
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                      <div className="space-y-1">
                        <Link
                          href={`/${locale}/ginseng/${relPlant.id}`}
                          className="line-clamp-2 text-xs font-bold text-gray-900 uppercase transition-colors hover:text-emerald-700"
                        >
                          {relPlant.name}
                        </Link>
                        <p className="text-sm font-extrabold text-emerald-700">
                          {formatVNDPrice(relPlant.price || 0)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 border-t border-gray-100 pt-2">
                        <Link
                          href={`/${locale}/ginseng/${relPlant.id}`}
                          className="w-full rounded-lg bg-emerald-600 py-2 text-center text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                        >
                          {tProd('viewDetails')}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
