'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { formatVNDPrice } from '@/utils/formatters';

type PriceRangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  minPrice: number;
  maxPrice: number;
  onMinChange: (val: number) => void;
  onMaxChange: (val: number) => void;
};

export const PriceRangeSlider = ({
  min,
  max,
  step = 10000,
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}: PriceRangeSliderProps) => {
  const t = useTranslations('products');
  const [prevMinPrice, setPrevMinPrice] = useState(minPrice);
  const [minInputVal, setMinInputVal] = useState<string>(formatVNDPrice(minPrice));
  if (minPrice !== prevMinPrice) {
    setPrevMinPrice(minPrice);
    setMinInputVal(formatVNDPrice(minPrice));
  }

  const [prevMaxPrice, setPrevMaxPrice] = useState(maxPrice);
  const [maxInputVal, setMaxInputVal] = useState<string>(formatVNDPrice(maxPrice));
  if (maxPrice !== prevMaxPrice) {
    setPrevMaxPrice(maxPrice);
    setMaxInputVal(formatVNDPrice(maxPrice));
  }

  const handleMinBlur = () => {
    const rawVal = Number(minInputVal.replace(/\D/g, ''));
    if (!Number.isNaN(rawVal)) {
      const clamped = Math.min(Math.max(rawVal, min), maxPrice - step);
      onMinChange(clamped);
      setMinInputVal(formatVNDPrice(clamped));
    } else {
      setMinInputVal(formatVNDPrice(minPrice));
    }
  };

  const handleMaxBlur = () => {
    const rawVal = Number(maxInputVal.replace(/\D/g, ''));
    if (!Number.isNaN(rawVal)) {
      const clamped = Math.max(Math.min(rawVal, max), minPrice + step);
      onMaxChange(clamped);
      setMaxInputVal(formatVNDPrice(clamped));
    } else {
      setMaxInputVal(formatVNDPrice(maxPrice));
    }
  };

  const minPercent = ((minPrice - min) / (max - min)) * 100;
  const maxPercent = ((maxPrice - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      {/* Price Input Controls */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            id="min-price-input"
            type="text"
            value={minInputVal}
            onChange={(e) => setMinInputVal(e.target.value)}
            onBlur={handleMinBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleMinBlur()}
            className="text-xs h-8 px-2 text-center"
            placeholder={formatVNDPrice(min)}
          />
        </div>
        <span className="text-gray-400 text-xs">-</span>
        <div className="flex-1">
          <Input
            id="max-price-input"
            type="text"
            value={maxInputVal}
            onChange={(e) => setMaxInputVal(e.target.value)}
            onBlur={handleMaxBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleMaxBlur()}
            className="text-xs h-8 px-2 text-center"
            placeholder={formatVNDPrice(max)}
          />
        </div>
      </div>

      {/* Dual Range Track */}
      <div className="relative flex items-center h-4 select-none touch-none">
        {/* Base Background Track */}
        <div className="absolute w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />

        {/* Selected Range Highlight */}
        <div
          className="absolute h-1.5 bg-primary rounded-full z-10"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
          }}
        />

        {/* Min Thumb Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          aria-label={t('filters.fromPrice', { price: minPrice })}
          value={minPrice}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), maxPrice - step);
            onMinChange(value);
          }}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer z-30 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
        />

        {/* Max Thumb Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          aria-label={t('filters.toPrice', { price: maxPrice })}
          value={maxPrice}
          onChange={(e) => {
            const value = Math.max(Number(e.target.value), minPrice + step);
            onMaxChange(value);
          }}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer z-40 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
        />
      </div>
    </div>
  );
};
