'use client';

import { useCallback, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

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
  const [minInputVal, setMinInputVal] = useState<string>(
    minPrice.toLocaleString('vi-VN') + ' đ'
  );
  const [maxInputVal, setMaxInputVal] = useState<string>(
    maxPrice.toLocaleString('vi-VN') + ' đ'
  );

  useEffect(() => {
    setMinInputVal(minPrice.toLocaleString('vi-VN') + ' đ');
  }, [minPrice]);

  useEffect(() => {
    setMaxInputVal(maxPrice.toLocaleString('vi-VN') + ' đ');
  }, [maxPrice]);

  const handleMinBlur = () => {
    const rawNum = parseInt(minInputVal.replace(/\D/g, ''), 10);
    if (isNaN(rawNum)) {
      setMinInputVal(minPrice.toLocaleString('vi-VN') + ' đ');
      return;
    }
    const clamped = Math.max(min, Math.min(rawNum, maxPrice - step));
    onMinChange(clamped);
    setMinInputVal(clamped.toLocaleString('vi-VN') + ' đ');
  };

  const handleMaxBlur = () => {
    const rawNum = parseInt(maxInputVal.replace(/\D/g, ''), 10);
    if (isNaN(rawNum)) {
      setMaxInputVal(maxPrice.toLocaleString('vi-VN') + ' đ');
      return;
    }
    const clamped = Math.min(max, Math.max(rawNum, minPrice + step));
    onMaxChange(clamped);
    setMaxInputVal(clamped.toLocaleString('vi-VN') + ' đ');
  };

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
      {/* Interactive Price Inputs */}
      <div className="flex justify-between items-center gap-2 text-xs font-bold text-gray-700">
        <Input
          type="text"
          value={minInputVal}
          onChange={(e) => setMinInputVal(e.target.value)}
          onFocus={() => {
            const raw = minInputVal.replace(/\D/g, '');
            setMinInputVal(raw);
          }}
          onBlur={handleMinBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleMinBlur();
          }}
          className="h-8 px-2 text-xs text-center font-mono border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-primary dark:text-emerald-400 font-bold focus:bg-white"
        />
        <span className="text-gray-400 font-normal shrink-0">—</span>
        <Input
          type="text"
          value={maxInputVal}
          onChange={(e) => setMaxInputVal(e.target.value)}
          onFocus={() => {
            const raw = maxInputVal.replace(/\D/g, '');
            setMaxInputVal(raw);
          }}
          onBlur={handleMaxBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleMaxBlur();
          }}
          className="h-8 px-2 text-xs text-center font-mono border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-primary dark:text-emerald-400 font-bold focus:bg-white"
        />
      </div>

      {/* Single Dual-Thumb Slider Track Container */}
      <div className="relative w-full h-6 flex items-center">
        {/* Background Track */}
        <div className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg pointer-events-none" />

        {/* Active Range Highlight */}
        <div
          className="absolute h-2 bg-primary dark:bg-emerald-600 rounded-lg pointer-events-none"
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
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer z-30 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
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
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer z-40 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
        />
      </div>
    </div>
  );
};
