import { Filter } from 'lucide-react';
import { PriceRangeSlider } from '@/components/common/PriceRangeSlider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export type ProductFilterSidebarProps = {
  title?: string;
  categories?: string[];
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
  ageOptions?: Array<{ label: string; value: number; id: string }>;
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
  title = 'Bộ Lọc Sản Phẩm',
  categories,
  selectedCategory,
  onSelectCategory,
  ageOptions,
  selectedAges,
  onAgeToggle,
  minPrice,
  maxPrice,
  minLimit = 0,
  maxLimit = 10000000,
  stepPrice = 50000,
  onMinPriceChange,
  onMaxPriceChange,
  hasActiveFilters,
  onClearFilters,
}: ProductFilterSidebarProps) => {
  const selectedAgeSet = new Set(selectedAges || []);

  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="rounded-2xl p-6">
        <CardContent className="p-0 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-base uppercase tracking-tight flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              <span>{title}</span>
            </h3>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 font-bold cursor-pointer"
              >
                Xóa lọc
              </Button>
            )}
          </div>

          {/* Filter by Category */}
          {categories && categories.length > 0 && onSelectCategory && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                Danh Mục Sản Phẩm
              </span>
              <div className="space-y-1.5">
                <Button
                  type="button"
                  variant={selectedCategory === null ? 'emerald' : 'ghost'}
                  size="sm"
                  onClick={() => onSelectCategory(null)}
                  className="w-full justify-start text-xs font-bold"
                >
                  Tất cả danh mục
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={selectedCategory === cat ? 'emerald' : 'ghost'}
                    size="sm"
                    onClick={() => onSelectCategory(cat)}
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
            <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                Độ Tuổi Cây Sâm
              </span>
              <div className="space-y-2.5">
                {ageOptions.map((age) => (
                  <label
                    key={age.value}
                    htmlFor={age.id}
                    className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-foreground hover:text-primary transition-colors py-0.5"
                  >
                    <Checkbox
                      id={age.id}
                      checked={selectedAgeSet.has(age.value)}
                      onCheckedChange={() => onAgeToggle?.(age.value)}
                      className="shrink-0"
                    />
                    <span>{age.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Filter by Price Range */}
          <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-5">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
              Khoảng Giá (VND)
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
