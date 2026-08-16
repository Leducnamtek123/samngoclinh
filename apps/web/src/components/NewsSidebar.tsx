'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Link } from '@/lib/I18nNavigation';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent } from './ui/card';

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
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  if (prevSearchQuery !== searchQuery) {
    setPrevSearchQuery(searchQuery);
    setSearchVal(searchQuery);
  }

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

  const newsImages = [
    '/images/news/news1.png',
    '/images/news/news2.png',
    '/images/news/news3.png',
    '/images/news/news4.png',
  ];

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <Card className="rounded-[24px] p-6">
        <CardContent className="p-0 space-y-4">
          <h3 className="text-gray-900 dark:text-gray-100 font-extrabold text-sm">
            Tìm kiếm bài viết
          </h3>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              aria-label="Tìm kiếm bài viết"
              className="pl-10 text-xs"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </form>
        </CardContent>
      </Card>

      {/* Categories Box */}
      <Card className="rounded-[24px] p-6">
        <CardContent className="p-0 space-y-4">
          <h3 className="text-gray-900 dark:text-gray-100 font-extrabold text-sm">
            Danh mục
          </h3>
          <div className="space-y-3.5">
            {/* Tất cả */}
            <button
              type="button"
              onClick={() => handleCategorySelect('')}
              className="flex items-center gap-3 w-full text-left group cursor-pointer bg-transparent border-0 p-0"
            >
              <Checkbox checked={!selectedCategory} />
              <span className={`text-xs font-semibold ${
                !selectedCategory ? 'text-primary font-bold' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary'
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
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className="flex items-center gap-3 w-full text-left group cursor-pointer bg-transparent border-0 p-0"
                >
                  <Checkbox checked={isChecked} />
                  <span className={`text-xs font-semibold ${
                    isChecked ? 'text-primary font-bold' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary'
                  }`}>
                    {getCategoryLabel(cat)}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Articles Box */}
      <Card className="rounded-[24px] p-6">
        <CardContent className="p-0 space-y-4">
          <h3 className="text-gray-900 dark:text-gray-100 font-extrabold text-sm">
            Bài viết gần đây
          </h3>
          <div className="space-y-4">
            {recentArticles.map((article: any, idx: number) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="flex items-center gap-3 group"
              >
                <div className="relative w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                  <Image
                    src={article.image || newsImages[idx % newsImages.length]}
                    alt={article.title}
                    fill
                    sizes="56px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] text-gray-400 font-semibold">
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : ''}
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
