'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useCatalogPlants } from '@/hooks/queries/useCatalog';
import { useBanner } from '@/hooks/queries/useBanner';
import { PageBannerSlider } from '@/components/PageBannerSlider';

type GinsengClientProps = {
  locale: string;
  initialItems?: any[];
  isLoggedIn?: boolean;
};

export const GinsengClient = ({ locale, initialItems, isLoggedIn }: GinsengClientProps) => {
  const t = useTranslations('products');
  const { data: items, isLoading, isError } = useCatalogPlants(initialItems);
  const { data: banners } = useBanner('ginseng');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAges, setSelectedAges] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(1000000);

  const handleAction = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      window.location.href = `/${locale}/sign-in?reason=ginseng`;
    }
  };

  const handleAgeToggle = (age: number) => {
    if (selectedAges.includes(age)) {
      setSelectedAges(selectedAges.filter(a => a !== age));
    } else {
      setSelectedAges([...selectedAges, age]);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedAges([]);
    setMinPrice(50000);
    setMaxPrice(1000000);
  };

  const displayItems = items || [];

  const processedItems = useMemo(() => {
    let result = [...displayItems];

    // Filter by search term
    if (searchTerm) {
      result = result.filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected ages
    if (selectedAges.length > 0) {
      result = result.filter((item: any) => {
        const age = item.ageYear || 1;
        return selectedAges.some(selectedAge => {
          if (selectedAge === 3) {
            return age >= 3;
          }
          return age === selectedAge;
        });
      });
    }

    // Filter by price range
    result = result.filter((item: any) => item.price >= minPrice && item.price <= maxPrice);

    // Sort
    result.sort((a: any, b: any) => b.id.localeCompare(a.id));

    return result;
  }, [displayItems, searchTerm, selectedAges, minPrice, maxPrice]);

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner Section */}
      <PageBannerSlider 
        banners={banners || []} 
        badgeText="Trồng sâm giống" 
        badgeIcon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V9m0 0a4 4 0 10-8 0m8 0a4 4 0 118 0M7 21h10" />
          </svg>
        }
      />

      {/* Main Layout Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">
                  Bộ lọc
                </h2>
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-[#1C3F24] hover:underline font-bold transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>

              {/* Cultivation Time Filter */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                  Thời gian trồng
                </h3>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-600 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedAges.length === 0}
                      onChange={() => setSelectedAges([])}
                      className="rounded border-gray-300 text-[#1C3F24] focus:ring-[#1C3F24] w-4 h-4 cursor-pointer"
                    />
                    <span>{t('all')}</span>
                  </label>
                  {[
                    { label: '1 năm', value: 1 },
                    { label: '2 năm', value: 2 },
                    { label: '3 năm trở lên', value: 3 },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-600 font-medium">
                      <input
                        type="checkbox"
                        checked={selectedAges.includes(opt.value)}
                        onChange={() => handleAgeToggle(opt.value)}
                        className="rounded border-gray-300 text-[#1C3F24] focus:ring-[#1C3F24] w-4 h-4 cursor-pointer"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                  Giá
                </h3>
                <div className="space-y-4">
                  <div className="relative h-1 w-full bg-gray-200 rounded-lg">
                    {/* Highlight range */}
                    <div 
                      className="absolute h-full bg-[#1C3F24] rounded-lg" 
                      style={{
                        left: `${((minPrice - 50000) / 950000) * 100}%`,
                        right: `${100 - ((maxPrice - 50000) / 950000) * 100}%`
                      }}
                    />
                    <input
                      type="range"
                      min="50000"
                      max="1000000"
                      step="50000"
                      value={minPrice}
                      onChange={(e) => {
                        const val = Math.min(Number(e.target.value), maxPrice - 50000);
                        setMinPrice(val);
                      }}
                      className="absolute w-full accent-[#1C3F24] h-1 top-0 left-0 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                    />
                    <input
                      type="range"
                      min="50000"
                      max="1000000"
                      step="50000"
                      value={maxPrice}
                      onChange={(e) => {
                        const val = Math.max(Number(e.target.value), minPrice + 50000);
                        setMaxPrice(val);
                      }}
                      className="absolute w-full accent-[#1C3F24] h-1 top-0 left-0 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                    <span>{minPrice.toLocaleString('vi-VN')}đ</span>
                    <span>{maxPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Grid Column */}
          <div className="flex-1 space-y-6">
            
            {/* Search Input Bar */}
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sản phẩm sâm giống..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-[#1C3F24] bg-white shadow-sm"
              />
              <div className="absolute left-3.5 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white border border-gray-200 rounded-2xl overflow-hidden p-5 space-y-4 animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-xl"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center font-medium">
                Có lỗi xảy ra khi tải danh mục sản phẩm sâm. Vui lòng tải lại trang.
              </div>
            ) : processedItems.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-medium bg-white rounded-2xl border border-gray-200 shadow-sm">
                Không tìm thấy sản phẩm nào khớp với bộ lọc.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    {/* Product Image Panel */}
                    <div className="relative h-64 bg-gray-50 flex items-center justify-center p-4">
                      {/* Badge "Trồng tại Kon Tum" */}
                      <span className="absolute top-3 left-3 bg-[#1C3F24]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
                        Trồng tại Kon Tum
                      </span>

                      {/* Favorite Heart Icon */}
                      <button className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-xs text-gray-400 hover:text-red-500 rounded-full transition-all shadow-xs z-10 hover:scale-105 active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>

                      <img
                        src={item.images?.[0] || item.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLuXy8pynMd9n3uXsIueZ4qIRS2WNO0S4OEociDUZ_OyEZNaaqmMzxQ2xn2TO1IzDsBxZez1hYYesLk5evUcf75DHGB6J89oP-T8CWiodimudqIPHhntR8tHXqs3WDjqTYLhivQBhpgoPMxRa-FwV3P9s54pTKKTQfO9M8wIlID3bDRQm0izlE87wrSRO5ngMAFxl77dCeBDEM9rDTRosaAxQgqmOSHb2J34UZsKnm8kBXTD-zhLyW'}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Details Panel */}
                    <div className="p-5 space-y-4">
                      <div className="space-y-2.5">
                        <h3 className="font-extrabold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[40px] uppercase group-hover:text-[#1C3F24] transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100">
                          <span className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Tuổi: {item.ageYear || 1} năm
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Còn: {item.stock || 0} cây
                          </span>
                        </div>
                      </div>

                      <div className="text-secondary font-extrabold text-base pt-1">
                        {item.price.toLocaleString('vi-VN')} đ
                      </div>

                      {/* Actions side-by-side with shopping cart icon inside the Buy Now button */}
                      <div className="flex gap-2.5 pt-2">
                        <a
                          href="/cart"
                          onClick={handleAction}
                          className="flex items-center justify-center gap-2 flex-1 bg-[#1C3F24] hover:bg-[#1C3F24]/90 text-white py-2.5 rounded-lg font-bold transition-all text-xs active:scale-98 shadow-xs"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Mua ngay
                        </a>

                        <button
                          onClick={handleAction}
                          className="p-2.5 border border-gray-300 hover:border-[#1C3F24] text-gray-500 hover:text-[#1C3F24] rounded-lg transition-colors flex items-center justify-center bg-white shadow-xs hover:bg-[#1C3F24]/5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
