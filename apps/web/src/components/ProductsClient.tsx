'use client';

import { useState } from 'react';
import { useCatalogPlants } from '@/hooks/queries/useCatalog';

type ProductsClientProps = {
  locale: string;
  initialItems?: any[];
};

export const ProductsClient = ({ locale: _locale, initialItems }: ProductsClientProps) => {
  const { data: items, isLoading, isError } = useCatalogPlants(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAges, setSelectedAges] = useState<number[]>([]);

  const filterAges = [
    { label: '1 năm', age: 1, count: 17 },
    { label: '2 năm', age: 2, count: 30 },
    { label: '3 năm', age: 3, count: 57 },
    { label: '4 năm', age: 4, count: 3 },
    { label: '5 năm', age: 5, count: 2 }
  ];

  const displayItems = items || [];

  const handleAgeToggle = (age: number) => {
    if (selectedAges.includes(age)) {
      setSelectedAges(selectedAges.filter(a => a !== age));
    } else {
      setSelectedAges([...selectedAges, age]);
    }
  };

  const filteredItems = displayItems.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAge = selectedAges.length === 0 || selectedAges.includes(item.age);
    return matchesSearch && matchesAge;
  });

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner Section */}
      <section className="bg-[#1C3F24]/5 bg-[url('/assets/images/banner_bg.png')] bg-cover py-16 px-4 md:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Cửa hàng cây giống
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary leading-tight font-display-lg">
            Cửa Hàng Cây Giống Digital
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Sở hữu và theo dõi quá trình sinh trưởng của cây sâm thật thông qua định danh số hóa.
          </p>
        </div>
      </section>

      {/* Main Catalog Layout */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column Filters */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-sm">Tìm kiếm sản phẩm</h4>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm cây trái, giống cây..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 pl-9 text-xs focus:outline-none focus:border-primary bg-white"
                  />
                  <div className="absolute left-3 top-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm">Lọc theo tuổi</h4>
                <div className="space-y-2">
                  {filterAges.map((age, idx) => (
                    <label key={idx} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer font-medium hover:text-primary">
                      <input
                        type="checkbox"
                        checked={selectedAges.includes(age.age)}
                        onChange={() => handleAgeToggle(age.age)}
                        className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                      />
                      <span>{age.label} <span className="text-gray-400">({age.count})</span></span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Catalog Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white border border-gray-200 rounded-2xl h-80"></div>
                ))}
              </div>
            ) : isError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center font-medium">
                Có lỗi xảy ra khi tải danh mục cây giống. Vui lòng tải lại trang.
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-medium bg-white rounded-2xl border border-gray-200">
                Không tìm thấy cây giống nào khớp với tiêu chí lọc.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    {/* Plant Card Header */}
                    <div>
                      <div className="relative h-60 bg-gray-50 flex items-center justify-center p-3">
                        <img
                          src={item.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8'}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain rounded-xl"
                        />
                        <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          TUỔI: {item.age} NĂM
                        </span>
                      </div>

                      {/* Plant Details */}
                      <div className="p-5 space-y-3">
                        <h3 className="font-bold text-gray-900 text-sm leading-snug">
                          {item.name}
                        </h3>
                        <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium">
                          <span>Mã số: {item.code}</span>
                          <span className="text-primary font-semibold">{item.origin}</span>
                        </div>
                      </div>
                    </div>

                    {/* Plant Card Action */}
                    <div className="p-5 pt-0">
                      <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
                        <div>
                          <p className="text-[9px] text-gray-400 uppercase font-semibold">Giá đầu tư</p>
                          <p className="font-bold text-secondary text-sm">{item.price.toLocaleString('vi-VN')} đ</p>
                        </div>
                        <a
                          href="/cart"
                          className="p-2 bg-[#4CAF50] hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1 px-4 py-2 text-xs font-bold shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Mua ngay</span>
                        </a>
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
