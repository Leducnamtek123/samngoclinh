'use client';

import { useState } from 'react';
import { useCatalogShopItems } from '@/hooks/queries/useCatalog';

type GinsengClientProps = {
  locale: string;
};

export const GinsengClient = ({ locale: _locale }: GinsengClientProps) => {
  const { data: items, isLoading, isError } = useCatalogShopItems();
  const [searchTerm, setSearchTerm] = useState('');

  // Fallback items if API is empty
  const fallbackItems = [
    {
      id: 'fallback-item-1',
      name: 'RƯỢU SÂM NGỌC LINH NGUYÊN CÂY - NGUYÊN CỦ',
      price: 7000000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLuXy8pynMd9n3uXsIueZ4qIRS2WNO0S4OEociDUZ_OyEZNaaqmMzxQ2xn2TO1IzDsBxZez1hYYesLk5evUcf75DHGB6J89oP-T8CWiodimudqIPHhntR8tHXqs3WDjqTYLhivQBhpgoPMxRa-FwV3P9s54pTKKTQfO9M8wIlID3bDRQm0izlE87wrSRO5ngMAFxl77dCeBDEM9rDTRosaAxQgqmOSHb2J34UZsKnm8kBXTD-zhLyW',
    },
    {
      id: 'fallback-item-2',
      name: 'SÂM NGỌC LINH CẮT LÁT SẤY THĂNG HOA 10G',
      price: 3500000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLuXy8pynMd9n3uXsIueZ4qIRS2WNO0S4OEociDUZ_OyEZNaaqmMzxQ2xn2TO1IzDsBxZez1hYYesLk5evUcf75DHGB6J89oP-T8CWiodimudqIPHhntR8tHXqs3WDjqTYLhivQBhpgoPMxRa-FwV3P9s54pTKKTQfO9M8wIlID3bDRQm0izlE87wrSRO5ngMAFxl77dCeBDEM9rDTRosaAxQgqmOSHb2J34UZsKnm8kBXTD-zhLyW',
    },
    {
      id: 'fallback-item-3',
      name: 'RƯỢU LÁ SÂM NGỌC LINH 100ML',
      price: 200000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLuXy8pynMd9n3uXsIueZ4qIRS2WNO0S4OEociDUZ_OyEZNaaqmMzxQ2xn2TO1IzDsBxZez1hYYesLk5evUcf75DHGB6J89oP-T8CWiodimudqIPHhntR8tHXqs3WDjqTYLhivQBhpgoPMxRa-FwV3P9s54pTKKTQfO9M8wIlID3bDRQm0izlE87wrSRO5ngMAFxl77dCeBDEM9rDTRosaAxQgqmOSHb2J34UZsKnm8kBXTD-zhLyW',
    },
    {
      id: 'fallback-item-4',
      name: 'RƯỢU BÔNG SÂM NGỌC LINH 1 LÍT',
      price: 1400000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLuXy8pynMd9n3uXsIueZ4qIRS2WNO0S4OEociDUZ_OyEZNaaqmMzxQ2xn2TO1IzDsBxZez1hYYesLk5evUcf75DHGB6J89oP-T8CWiodimudqIPHhntR8tHXqs3WDjqTYLhivQBhpgoPMxRa-FwV3P9s54pTKKTQfO9M8wIlID3bDRQm0izlE87wrSRO5ngMAFxl77dCeBDEM9rDTRosaAxQgqmOSHb2J34UZsKnm8kBXTD-zhLyW',
    }
  ];

  const displayItems = items && items.length > 0 ? items : fallbackItems;

  const filteredItems = displayItems.filter((item: any) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner Section */}
      <section className="bg-[#1C3F24]/5 bg-[url('/assets/images/banner_bg.png')] bg-cover py-16 px-4 md:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V9m0 0a4 4 0 10-8 0m8 0a4 4 0 118 0M7 21h10" />
            </svg>
            Trồng sâm
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary leading-tight font-display-lg">
            Trồng Sâm Cùng Rượu Sâm Ngọc Linh
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Trải nghiệm mô hình trồng sâm cùng Rượu Sâm Ngọc Linh qua nền tảng công nghệ số. Kiến tạo giá trị bền vững với những củ Sâm Ngọc Linh minh bạch nguồn gốc và đạt chuẩn chất lượng tuyệt đối.
          </p>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-end">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sản phẩm sâm..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-primary bg-white shadow-sm"
            />
            <div className="absolute left-3.5 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-gray-200 rounded-2xl overflow-hidden p-5 space-y-4 animate-pulse">
                <div className="bg-gray-200 h-64 rounded-xl"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center font-medium">
            Có lỗi xảy ra khi tải danh mục sản phẩm sâm. Vui lòng tải lại trang.
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-medium">
            Không tìm thấy sản phẩm nào khớp với từ khóa tìm kiếm.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item: any) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={item.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLuXy8pynMd9n3uXsIueZ4qIRS2WNO0S4OEociDUZ_OyEZNaaqmMzxQ2xn2TO1IzDsBxZez1hYYesLk5evUcf75DHGB6J89oP-T8CWiodimudqIPHhntR8tHXqs3WDjqTYLhivQBhpgoPMxRa-FwV3P9s54pTKKTQfO9M8wIlID3bDRQm0izlE87wrSRO5ngMAFxl77dCeBDEM9rDTRosaAxQgqmOSHb2J34UZsKnm8kBXTD-zhLyW'}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                </div>

                {/* Product info & Action */}
                <div className="p-5 space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[40px] uppercase">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-secondary font-extrabold text-base">
                      {item.price.toLocaleString('vi-VN')} đ
                    </div>
                    <button className="p-2.5 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-lg transition-colors flex items-center justify-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>

                  <a
                    href="/cart"
                    className="block w-full text-center bg-[#4CAF50] hover:bg-emerald-600 text-white py-2.5 rounded-lg font-bold transition-colors text-xs"
                  >
                    Mua ngay
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
