'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
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
  step = 10_000,
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
    const rawVal = Number(minInputVal.replaceAll(/\D/g, ''));
    if (Number.isNaN(rawVal)) {
      setMinInputVal(formatVNDPrice(minPrice));
    } else {
      const clamped = Math.min(Math.max(rawVal, min), maxPrice - step);
      onMinChange(clamped);
      setMinInputVal(formatVNDPrice(clamped));
    }
  };

  const handleMaxBlur = () => {
    const rawVal = Number(maxInputVal.replaceAll(/\D/g, ''));
    if (Number.isNaN(rawVal)) {
      setMaxInputVal(formatVNDPrice(maxPrice));
    } else {
      const clamped = Math.max(Math.min(rawVal, max), minPrice + step);
      onMaxChange(clamped);
      setMaxInputVal(formatVNDPrice(clamped));
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
            onChange={(e) => {
              setMinInputVal(e.target.value);
            }}
            onBlur={handleMinBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleMinBlur()}
            className="h-8 px-2 text-center text-xs"
            placeholder={formatVNDPrice(min)}
          />
        </div>
        <span className="text-xs text-gray-400">-</span>
        <div className="flex-1">
          <Input
            id="max-price-input"
            type="text"
            value={maxInputVal}
            onChange={(e) => {
              setMaxInputVal(e.target.value);
            }}
            onBlur={handleMaxBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleMaxBlur()}
            className="h-8 px-2 text-center text-xs"
            placeholder={formatVNDPrice(max)}
          />
        </div>
      </div>

      {/* Dual Range Track */}
      <div className="relative flex h-4 touch-none items-center select-none">
        {/* Base Background Track */}
        <div className="absolute h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700" />

        {/* Selected Range Highlight */}
        <div
          className="absolute z-10 h-1.5 rounded-full bg-primary"
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
          className="pointer-events-none absolute z-30 h-2 w-full cursor-pointer appearance-none bg-transparent focus:outline-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
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
          className="pointer-events-none absolute z-40 h-2 w-full cursor-pointer appearance-none bg-transparent focus:outline-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
    </div>
  );
};
