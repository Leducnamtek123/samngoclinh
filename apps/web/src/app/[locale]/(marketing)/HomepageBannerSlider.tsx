'use client';

import { useState, useEffect, useRef } from 'react';

type HomepageBannerSliderProps = {
  images: string[];
};

export function HomepageBannerSlider({ images }: HomepageBannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;

    if (!isHovered) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [images.length, isHovered]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.4/1] rounded-2xl sm:rounded-3xl bg-white/5 border border-gray-200 shadow-lg flex items-center justify-center text-gray-500">
        Không có hình ảnh banner
      </div>
    );
  }

  return (
    <div 
      className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.4/1] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-xl bg-black/5 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={image}
              alt={`Sâm Ngọc Linh Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Indicators / Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleDotClick(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer border-0 ${
              index === currentIndex 
                ? 'bg-white scale-125 shadow-md w-6' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
