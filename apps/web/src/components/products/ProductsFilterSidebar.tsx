type ProductsFilterSidebarProps = {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  minPrice: number;
  setMinPrice: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  searchTerm: string;
  onClearFilters: () => void;
};

export const ProductsFilterSidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  searchTerm,
  onClearFilters,
}: ProductsFilterSidebarProps) => {
  const hasActiveFilters = selectedCategory !== null || minPrice !== 50000 || maxPrice !== 5000000 || searchTerm !== '';

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="font-extrabold text-gray-900 text-base uppercase tracking-tight flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1C3F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Bộ Lọc Sản Phẩm</span>
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

        {/* Filter by Category */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
            Danh Mục Sản Phẩm
          </span>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === null
                  ? 'bg-[#1C3F24] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tất cả danh mục
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1C3F24] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
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
                <label htmlFor="products-min-price">Giá tối thiểu:</label>
                <span className="text-[#1C3F24]">{minPrice.toLocaleString('vi-VN')} đ</span>
              </div>
              <input
                id="products-min-price"
                type="range"
                min="50000"
                max="1000000"
                step="50000"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1C3F24]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
                <label htmlFor="products-max-price">Giá tối đa:</label>
                <span className="text-[#1C3F24]">{maxPrice.toLocaleString('vi-VN')} đ</span>
              </div>
              <input
                id="products-max-price"
                type="range"
                min="1000000"
                max="5000000"
                step="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1C3F24]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
