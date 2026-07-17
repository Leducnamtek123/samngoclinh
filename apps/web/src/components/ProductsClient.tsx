'use client';

import { useState } from 'react';
import { useCatalogShopItems } from '@/hooks/queries/useCatalog';

type ProductsClientProps = {
  locale: string;
  initialItems?: any[];
};

export const ProductsClient = ({ locale: _locale, initialItems }: ProductsClientProps) => {
  const { data: items, isLoading, isError } = useCatalogShopItems(initialItems);
  const [searchTerm, setSearchTerm] = useState('');

  const displayItems = items || [];

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Sản phẩm rượu sâm
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary leading-tight font-display-lg">
            Sản Phẩm Rượu Sâm Ngọc Linh
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Khám phá danh mục sản phẩm rượu sâm Ngọc Linh nguyên cây, nguyên củ và các chế phẩm sâm cao cấp khác.
          </p>
        </div>
      </section>

      {/* Search Section */}
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

      {/* Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-gray-200 rounded-2xl h-80"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center font-medium">
            Có lỗi xảy ra khi tải danh mục sản phẩm. Vui lòng tải lại trang.
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-medium bg-white rounded-2xl border border-gray-200">
            Không tìm thấy sản phẩm nào khớp với tiêu chí lọc.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item: any) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
              >
                {/* Product Image */}
                <div>
                  <div className="relative h-60 bg-gray-50 flex items-center justify-center p-3">
                    <img
                      src={item.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLuXy8pynMd9n3uXsIueZ4qIRS2WNO0S4OEociDUZ_OyEZNaaqmMzxQ2xn2TO1IzDsBxZez1hYYesLk5evUcf75DHGB6J89oP-T8CWiodimudqIPHhntR8tHXqs3WDjqTYLhivQBhpgoPMxRa-FwV3P9s54pTKKTQfO9M8wIlID3bDRQm0izlE87wrSRO5ngMAFxl77dCeBDEM9rDTRosaAxQgqmOSHb2J34UZsKnm8kBXTD-zhLyW'}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain rounded-xl"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[40px] uppercase">
                      {item.name}
                    </h3>
                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-semibold">
                      <span>Sâm Ngọc Linh Kon Tum</span>
                      <span className="text-primary uppercase tracking-wider">Chính hãng</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-semibold">Giá bán</p>
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
      </section>
    </div>
  );
};
