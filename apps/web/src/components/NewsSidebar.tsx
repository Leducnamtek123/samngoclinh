'use client';

import { Search } from 'lucide-react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { Article } from '@/types';
import { Link } from '@/lib/I18nNavigation';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';

type NewsSidebarProps = {
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  recentArticles: Article[];
};

export const NewsSidebar = ({
  categories,
  selectedCategory,
  searchQuery,
  recentArticles,
}: NewsSidebarProps) => {
  const locale = useLocale();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchVal, setSearchVal] = useState(searchQuery);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  if (prevSearchQuery !== searchQuery) {
    setPrevSearchQuery(searchQuery);
    setSearchVal(searchQuery);
  }

  const getCategoryLabel = (category: string) => {
    const labelsVi: Record<string, string> = {
      news: 'Tin tức',
      event: 'Sự kiện',
      guide: 'Hướng dẫn sử dụng',
      faq: 'Kiến thức',
    };
    const labelsEn: Record<string, string> = {
      news: 'News',
      event: 'Events',
      guide: 'User Guide',
      faq: 'Knowledge',
    };
    const map = locale === 'en' ? labelsEn : labelsVi;
    return map[category] || category;
  };

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
        <CardContent className="space-y-4 p-0">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100">
            {locale === 'en' ? 'Search Articles' : 'Tìm kiếm bài viết'}
          </h3>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="text"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
              }}
              aria-label={locale === 'en' ? 'Search articles' : 'Tìm kiếm bài viết'}
              className="pl-10 text-xs"
            />
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </form>
        </CardContent>
      </Card>

      {/* Categories Box */}
      <Card className="rounded-[24px] p-6">
        <CardContent className="space-y-4 p-0">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100">
            {locale === 'en' ? 'Categories' : 'Danh mục'}
          </h3>
          <div className="space-y-3.5">
            {/* All */}
            <button
              type="button"
              onClick={() => {
                handleCategorySelect('');
              }}
              className="group flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left"
            >
              <Checkbox checked={!selectedCategory} />
              <span
                className={`text-xs font-semibold ${
                  selectedCategory
                    ? 'text-gray-600 group-hover:text-primary dark:text-gray-400'
                    : 'font-bold text-primary'
                }`}
              >
                {locale === 'en' ? 'All' : 'Tất cả'}
              </span>
            </button>

            {/* Dynamic Categories */}
            {categories.map((cat) => {
              const isChecked = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    handleCategorySelect(cat);
                  }}
                  className="group flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left"
                >
                  <Checkbox checked={isChecked} />
                  <span
                    className={`text-xs font-semibold ${
                      isChecked
                        ? 'font-bold text-primary'
                        : 'text-gray-600 group-hover:text-primary dark:text-gray-400'
                    }`}
                  >
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
        <CardContent className="space-y-4 p-0">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100">
            {locale === 'en' ? 'Recent Articles' : 'Bài viết gần đây'}
          </h3>
          <div className="space-y-4">
            {recentArticles.map((article: Article, idx: number) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group flex items-center gap-3"
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
                  <Image
                    src={article.image || newsImages[idx % newsImages.length] || '/images/default_plant.png'}
                    alt={article.title}
                    fill
                    sizes="56px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-semibold text-gray-400">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString(
                          locale === 'en' ? 'en-US' : 'vi-VN',
                        )
                      : ''}
                  </div>
                  <h4 className="line-clamp-2 text-xs leading-snug font-bold text-gray-800 transition-colors group-hover:text-primary dark:text-gray-200">
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
