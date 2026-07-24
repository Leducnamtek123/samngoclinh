'use client';

import { useState, useEffect, useRef } from 'react';

interface Banner {
  id: string;
  pageKey: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
}

type PageBannerSliderProps = {
  banners: Banner[];
  badgeText: string;
  badgeIcon: React.ReactNode;
};

export function PageBannerSlider({ banners, badgeText, badgeIcon }: PageBannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (banners.length <= 1) return;

    if (!isHovered) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 5500);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [banners.length, isHovered]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (!banners || banners.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-b border-gray-200 w-full h-[260px] sm:h-[300px] md:h-[340px] bg-black">
      {/* Slides */}
      <div className="absolute inset-0 w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center flex items-center justify-center px-4 md:px-8 text-center ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('${banner.image}')` }}
          >
            <div className="max-w-4xl mx-auto space-y-4 relative z-20">
              <div className="inline-flex items-center gap-2 bg-emerald-600/35 text-white border border-emerald-400/30 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
                {badgeIcon}
                {badgeText}
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-display-lg drop-shadow-md">
                {banner.title}
              </h1>
              <p className="text-gray-200 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
                {banner.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators / Dots for slider */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer border-0 ${
                index === currentIndex 
                  ? 'bg-white scale-125 shadow-md w-5' 
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
