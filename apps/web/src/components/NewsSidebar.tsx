'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Link } from '@/libs/I18nNavigation';

const categoryLabels: Record<string, string> = {
  'news': 'Tin tức',
  'event': 'Sự kiện',
  'guide': 'Hướng dẫn sử dụng app',
  'faq': 'Kiến thức'
};

const getCategoryLabel = (category: string) => {
  return categoryLabels[category] || category;
};

type NewsSidebarProps = {
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  recentArticles: any[];
};

export const NewsSidebar = ({
  categories,
  selectedCategory,
  searchQuery,
  recentArticles,
}: NewsSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchVal, setSearchVal] = useState(searchQuery);

  // Sync state with URL search query changes
  useEffect(() => {
    setSearchVal(searchQuery);
  }, [searchQuery]);

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    // Always reset page to 1 on filter/search change
    params.set('page', '1');

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ search: searchVal });
  };

  const handleCategorySelect = (category: string) => {
    updateQueryParams({ category: category === '' ? null : category });
  };

  // We map static illustration images based on index or slug
  const newsImages = [
    '/images/news/news1.png',
    '/images/news/news2.png',
    '/images/news/news3.png',
    '/images/news/news4.png',
  ];

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
        <h3 className="text-gray-900 font-extrabold text-sm mb-4">
          Tìm kiếm bài viết
        </h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none transition-all placeholder-gray-400 focus:border-primary focus:bg-white text-gray-800"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.602Z" />
            </svg>
          </span>
        </form>
      </div>

      {/* Categories Box */}
      <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
        <h3 className="text-gray-900 font-extrabold text-sm mb-4">
          Danh mục
        </h3>
        <div className="space-y-3.5">
          {/* Tất cả */}
          <button
            onClick={() => handleCategorySelect('')}
            className="flex items-center gap-3 w-full text-left group cursor-pointer"
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              !selectedCategory 
                ? 'bg-primary border-primary text-white' 
                : 'border-gray-300 group-hover:border-primary bg-white'
            }`}>
              {!selectedCategory && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </div>
            <span className={`text-xs font-semibold ${
              !selectedCategory ? 'text-primary font-bold' : 'text-gray-600 group-hover:text-primary'
            }`}>
              Tất cả
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const isChecked = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className="flex items-center gap-3 w-full text-left group cursor-pointer"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  isChecked 
                    ? 'bg-primary border-primary text-white' 
                    : 'border-gray-300 group-hover:border-primary bg-white'
                }`}>
                  {isChecked && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs font-semibold ${
                  isChecked ? 'text-primary font-bold' : 'text-gray-600 group-hover:text-primary'
                }`}>
                  {getCategoryLabel(cat)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Articles Box */}
      <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
        <h3 className="text-gray-900 font-extrabold text-sm mb-4">
          Bài viết gần đây
        </h3>
        <div className="space-y-4">
          {recentArticles.map((article: any, idx: number) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="flex items-center gap-3 group"
            >
              <img
                src={article.image || newsImages[idx % newsImages.length]}
                alt={article.title}
                className="w-14 h-14 object-cover rounded-xl bg-gray-50 flex-shrink-0"
              />
              <div className="space-y-0.5">
                <div className="text-[10px] text-gray-400 font-semibold">
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('vi-VN') : ''}
                </div>
                <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
