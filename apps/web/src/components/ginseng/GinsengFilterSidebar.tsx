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
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="font-extrabold text-gray-900 text-base uppercase tracking-tight flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1C3F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Bộ Lọc Sâm</span>
          </h3>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs text-red-600 hover:underline font-bold cursor-pointer"
            >
              Xóa lọc
            </button>
          )}
        </div>

        {/* Filter by Age */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
            Độ Tuổi Cây Sâm
          </span>
          <div className="space-y-2">
            {[
              { label: '1 Năm Tuổi', value: 1, id: 'age-1' },
              { label: '2 Năm Tuổi', value: 2, id: 'age-2' },
              { label: 'Từ 3 Năm Tuổi+', value: 3, id: 'age-3' },
            ].map((age) => (
              <label key={age.value} htmlFor={age.id} className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-gray-700 hover:text-[#1C3F24]">
                <input
                  id={age.id}
                  type="checkbox"
                  checked={selectedAges.includes(age.value)}
                  onChange={() => onAgeToggle(age.value)}
                  className="w-4 h-4 text-[#1C3F24] rounded border-gray-300 focus:ring-[#1C3F24]"
                />
                <span>{age.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter by Price Range */}
        <div className="space-y-3 border-t border-gray-100 pt-5">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
            Khoảng Giá (VND)
          </span>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
                <label htmlFor="min-price-slider">Giá tối thiểu:</label>
                <span className="text-[#1C3F24]">{minPrice.toLocaleString('vi-VN')} đ</span>
              </div>
              <input
                id="min-price-slider"
                type="range"
                min="50000"
                max="500000"
                step="10000"
                value={minPrice}
                onChange={(e) => onMinPriceChange(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1C3F24]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
                <label htmlFor="max-price-slider">Giá tối đa:</label>
                <span className="text-[#1C3F24]">{maxPrice.toLocaleString('vi-VN')} đ</span>
              </div>
              <input
                id="max-price-slider"
                type="range"
                min="500000"
                max="1000000"
                step="50000"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1C3F24]"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
