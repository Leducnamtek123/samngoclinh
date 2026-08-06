import { Filter } from 'lucide-react';
import { PriceRangeSlider } from '@/components/common/PriceRangeSlider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type GinsengFilterSidebarProps = {
  selectedAges: number[];
  searchTerm: string;
  minPrice: number;
  maxPrice: number;
  onAgeToggle: (age: number) => void;
  onMinPriceChange: (val: number) => void;
  onMaxPriceChange: (val: number) => void;
  onClearFilters: () => void;
};

export const GinsengFilterSidebar = ({
  selectedAges,
  searchTerm,
  minPrice,
  maxPrice,
  onAgeToggle,
  onMinPriceChange,
  onMaxPriceChange,
  onClearFilters,
}: GinsengFilterSidebarProps) => {
  const hasActiveFilters = selectedAges.length > 0 || searchTerm || minPrice !== 50000 || maxPrice !== 1000000;

  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="rounded-2xl p-6">
        <CardContent className="p-0 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-base uppercase tracking-tight flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              <span>Bộ Lọc Sâm</span>
            </h3>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 font-bold"
              >
                Xóa lọc
              </Button>
            )}
          </div>

          {/* Filter by Age */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
              Độ Tuổi Cây Sâm
            </span>
            <div className="space-y-2.5">
              {[
                { label: '1 Năm Tuổi', value: 1, id: 'age-1' },
                { label: '2 Năm Tuổi', value: 2, id: 'age-2' },
                { label: 'Từ 3 Năm Tuổi+', value: 3, id: 'age-3' },
              ].map((age) => (
                <div
                  key={age.value}
                  role="button"
                  tabIndex={0}
                  onClick={() => onAgeToggle(age.value)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onAgeToggle(age.value)}
                  className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-800"
                >
                  <Checkbox
                    id={age.id}
                    checked={selectedAges.includes(age.value)}
                  />
                  <span>{age.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter by Price Range */}
          <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-5">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
              Khoảng Giá (VND)
            </span>
            
            <PriceRangeSlider
              min={0}
              max={2000000}
              step={20000}
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
