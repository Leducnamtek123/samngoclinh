'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import type { Banner } from '@/types';

export type PageBannerSliderProps = {
  banners?: Banner | Banner[];
  images?: string[];
  badgeText?: string;
  badgeIcon?: React.ReactNode;
};

export function PageBannerSlider({ banners = [], images = [] }: PageBannerSliderProps) {
  const t = useTranslations('homepage');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanBannerImage = (img?: string) => {
    if (!img || img.includes('banner_bg') || img.trim() === '') {
      return '/images/banners/homepage_banner_1.png';
    }
    return img;
  };

  const defaultSubtitle = t('bannerDefaultSubtitle');

  const rawList: Banner[] = Array.isArray(banners) ? banners : banners ? [banners] : [];
  const safeBanners: Banner[] = (
    rawList.length > 0
      ? rawList
      : images.map((img, idx) => ({
          id: `img-${idx}`,
          pageKey: 'home',
          title: 'SÂM NGỌC LINH KON TUM',
          subtitle: defaultSubtitle,
          image: img,
          order: idx,
        }))
  ).map((b) => ({
    ...b,
    image: cleanBannerImage(b.image),
    title: b.title || 'SÂM NGỌC LINH KON TUM',
    subtitle: b.subtitle || defaultSubtitle,
  }));

  useEffect(() => {
    if (safeBanners.length <= 1) {
      return;
    }

    if (!isHovered) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % safeBanners.length);
      }, 5500);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [safeBanners.length, isHovered]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (safeBanners.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[260px] w-full overflow-hidden border-b border-gray-200 bg-black sm:h-[300px] md:h-[340px]">
      {/* Slides */}
      <div className="absolute inset-0 h-full w-full">
        {safeBanners.map((banner, index) => (
          <div
            key={banner.id}
            onMouseEnter={() => {
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
            }}
            className={`absolute inset-0 flex items-center justify-center bg-cover bg-center px-4 text-center transition-opacity duration-1000 ease-in-out md:px-8 ${
              index === currentIndex ? 'z-10 opacity-100' : 'z-0 opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('${banner.image}')`,
            }}
          >
            <div className="relative z-20 mx-auto max-w-4xl space-y-3">
              <h1 className="font-display-lg text-2xl leading-tight font-extrabold tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl">
                {banner.title}
              </h1>
              <p className="mx-auto max-w-2xl text-xs leading-relaxed font-medium text-gray-200 drop-shadow-sm sm:text-sm md:text-base">
                {banner.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators / Dots for slider */}
      {safeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {safeBanners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => {
                handleDotClick(index);
              }}
              className={`h-2 w-2 cursor-pointer rounded-full border-0 transition-colors duration-300 ${
                index === currentIndex
                  ? 'w-5 scale-125 bg-white shadow-md'
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
