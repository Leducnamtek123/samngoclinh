'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

type HomepageBannerSliderProps = {
  images: string[];
};

export function HomepageBannerSlider({ images = [] }: HomepageBannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const cleanBannerImage = (img?: string) => {
    if (!img || img.includes('banner_bg') || img.trim() === '') {
      return '/images/banners/homepage_banner_1.png';
    }
    return img;
  };

  const safeImages = (Array.isArray(images) && images.length > 0
    ? images
    : [
        '/images/banners/homepage_banner_1.png',
        '/images/banners/homepage_banner_2.png',
        '/images/banners/homepage_banner_3.png',
        '/images/banners/homepage_banner_4.png',
        '/images/banners/homepage_banner_5.png',
      ]
  ).map(cleanBannerImage);

  useEffect(() => {
    if (safeImages.length <= 1) return;

    if (!isHovered) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % safeImages.length);
      }, 5000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [safeImages.length, isHovered]);

  // Subtle GSAP entrance animation for active slide
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const activeSlide = el.querySelector(`.slide-item-${currentIndex}`);
    if (activeSlide) {
      gsap.fromTo(
        activeSlide,
        { scale: 1.05, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' }
      );
    }
  }, [currentIndex]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (safeImages.length === 0) {
    return (
      <div className="w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.4/1] rounded-2xl sm:rounded-3xl bg-white/5 border border-gray-200 shadow-lg flex items-center justify-center text-gray-500">
        Không có hình ảnh banner
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.4/1] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100/60 shadow-2xl bg-black/5 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={image}
            className={`slide-item-${index} absolute inset-0 transition-opacity duration-1000 ease-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={image}
              alt={`Sâm Ngọc Linh Banner ${index + 1}`}
              fill
              sizes="100vw"
              priority={index === 0}
              unoptimized
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
            />
            {/* Subtle Gradient Overlay for visual depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Nature-inspired floating decorative badge */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 bg-white/80 backdrop-blur-md border border-white/60 text-primary px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce-subtle pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="tracking-wide uppercase text-[10px] sm:text-xs">Sâm Ngọc Linh Kon Tum</span>
      </div>

      {/* Indicators / Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => handleDotClick(index)}
            className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer border-0 ${
              index === currentIndex 
                ? 'bg-white shadow-lg w-8 scale-105' 
                : 'bg-white/50 hover:bg-white/80 w-2.5'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
