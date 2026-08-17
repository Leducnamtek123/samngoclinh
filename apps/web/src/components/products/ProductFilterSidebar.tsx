'use client';

import { Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PriceRangeSlider } from '@/components/common/PriceRangeSlider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export type ProductFilterSidebarProps = {
  title?: string;
  categories?: string[];
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
  ageOptions?: { label: string; value: number; id: string }[];
  selectedAges?: number[];
  onAgeToggle?: (age: number) => void;
  minPrice: number;
  maxPrice: number;
  minLimit?: number;
  maxLimit?: number;
  stepPrice?: number;
  onMinPriceChange: (val: number) => void;
  onMaxPriceChange: (val: number) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

export const ProductFilterSidebar = ({
  title,
  categories,
  selectedCategory,
  onSelectCategory,
  ageOptions,
  selectedAges,
  onAgeToggle,
  minPrice,
  maxPrice,
  minLimit = 0,
  maxLimit = 10_000_000,
  stepPrice = 50_000,
  onMinPriceChange,
  onMaxPriceChange,
  hasActiveFilters,
  onClearFilters,
}: ProductFilterSidebarProps) => {
  const t = useTranslations('products');
  const tActions = useTranslations('actions');

  const selectedAgeSet = new Set(selectedAges || []);

  return (
    <div className="space-y-6 lg:col-span-1">
      <Card className="rounded-2xl p-6">
        <CardContent className="space-y-6 p-0">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
            <h3 className="flex items-center gap-2 text-base font-extrabold tracking-tight text-gray-900 uppercase dark:text-gray-100">
              <Filter className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
              <span>{title || t('filterTitle')}</span>
            </h3>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="cursor-pointer text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
              >
                {tActions('clearFilters')}
              </Button>
            )}
          </div>

          {/* Filter by Category */}
          {categories && categories.length > 0 && onSelectCategory && (
            <div className="space-y-3">
              <span className="block text-xs font-bold tracking-wider text-gray-700 uppercase dark:text-gray-300">
                {t('categories')}
              </span>
              <div className="space-y-1.5">
                <Button
                  type="button"
                  variant={selectedCategory === null ? 'emerald' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    onSelectCategory(null);
                  }}
                  className="w-full justify-start text-xs font-bold"
                >
                  {t('allProducts')}
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={selectedCategory === cat ? 'emerald' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      onSelectCategory(cat);
                    }}
                    className="w-full justify-start text-xs font-bold"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Filter by Age */}
          {ageOptions && ageOptions.length > 0 && onAgeToggle && (
            <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800">
              <span className="block text-xs font-bold tracking-wider text-gray-700 uppercase dark:text-gray-300">
                {t('filterByAge')}
              </span>
              <div className="space-y-2.5">
                {ageOptions.map((age) => (
                  <label
                    key={age.value}
                    htmlFor={age.id}
                    className="flex cursor-pointer items-center gap-3 py-0.5 text-xs font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    <Checkbox
                      id={age.id}
                      checked={selectedAgeSet.has(age.value)}
                      onCheckedChange={() => {
                        onAgeToggle?.(age.value);
                      }}
                      className="shrink-0"
                    />
                    <span>{age.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Filter by Price Range */}
          <div className="space-y-3 border-t border-gray-100 pt-5 dark:border-gray-800">
            <span className="block text-xs font-bold tracking-wider text-gray-700 uppercase dark:text-gray-300">
              {t('priceRange')}
            </span>
            <PriceRangeSlider
              min={minLimit}
              max={maxLimit}
              step={stepPrice}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinChange={onMinPriceChange}
              onMaxChange={onMaxPriceChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
