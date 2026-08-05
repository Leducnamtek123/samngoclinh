'use client';

import { useCallback } from 'react';

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
  const getPercent = useCallback(
    (value: number) => {
      const clamped = Math.max(min, Math.min(max, value));
      return Math.round(((clamped - min) / (max - min || 1)) * 100);
    },
    [min, max]
  );

  const minPercent = getPercent(minPrice);
  const maxPercent = getPercent(maxPrice);

  return (
    <div className="space-y-3">
      {/* Price Header Display */}
      <div className="flex justify-between items-center text-xs font-bold text-gray-700">
        <span className="bg-gray-50 text-[#1C3F24] px-2.5 py-1 rounded-lg border border-gray-200 font-mono">
          {minPrice.toLocaleString('vi-VN')} đ
        </span>
        <span className="text-gray-400 font-normal">—</span>
        <span className="bg-gray-50 text-[#1C3F24] px-2.5 py-1 rounded-lg border border-gray-200 font-mono">
          {maxPrice.toLocaleString('vi-VN')} đ
        </span>
      </div>

      {/* Single Dual-Thumb Slider Track Container */}
      <div className="relative w-full h-6 flex items-center">
        {/* Background Track */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-lg pointer-events-none" />

        {/* Active Range Highlight */}
        <div
          className="absolute h-2 bg-[#1C3F24] rounded-lg pointer-events-none"
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
          aria-label="Giá tối thiểu"
          value={minPrice}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), maxPrice - step);
            onMinChange(value);
          }}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer z-30 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1C3F24] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#1C3F24] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
        />

        {/* Max Thumb Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          aria-label="Giá tối đa"
          value={maxPrice}
          onChange={(e) => {
            const value = Math.max(Number(e.target.value), minPrice + step);
            onMaxChange(value);
          }}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer z-40 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1C3F24] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#1C3F24] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
        />
      </div>
    </div>
  );
};
