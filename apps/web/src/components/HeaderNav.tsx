'use client';

import { Gift } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchApiClient } from '@/lib/ApiClient';
import { Link } from '@/lib/I18nNavigation';

export const HeaderNav = () => {
  const tNav = useTranslations('nav');
  const tCat = useTranslations('categories');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get('category') || '';

  const getCategoryLabel = (category: string) => {
    try {
      return tCat.has(category as Parameters<typeof tCat.has>[0])
        ? tCat(category as Parameters<typeof tCat>[0])
        : category;
    } catch {
      return category;
    }
  };

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchApiClient('/public/content/articles');
        const rawList = Array.isArray(data?.data) ? (data.data as { category?: string }[]) : [];
        const uniqueCategories: string[] = Array.from(
          new Set(rawList.flatMap((item) => (item.category ? [String(item.category)] : []))),
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to load categories for header nav:', error);
      }
    };
    loadCategories();
  }, []);

  const isActive = (href: string) => {
    if (!pathname) {
      return href === '/';
    }
    const rawPath = pathname.replace(/^\/(vi|en)/, '') || '/';

    if (href === '/') {
      return rawPath === '/';
    }

    return rawPath === href;
  };

  const isNewsActive = pathname ? pathname.replace(/^\/(vi|en)/, '').startsWith('/news') : false;

  return (
    <>
      {/* Trang chủ */}
      <li className="flex items-center">
        <Link
          href="/"
          className={`inline-flex h-8 items-center justify-center px-1 text-xs leading-none font-semibold whitespace-nowrap transition-colors xl:text-sm ${
            isActive('/') ? 'font-bold text-emerald-800' : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          {tNav('home')}
        </Link>
      </li>

      {/* Khuyến mãi */}
      <li className="flex items-center">
        <Link
          href="/campaigns/free-tree"
          className={`inline-flex h-8 flex-shrink-0 items-center justify-center gap-1.5 rounded-full border px-3 text-xs leading-none font-bold whitespace-nowrap transition-colors ${
            isActive('/campaigns/free-tree')
              ? 'border-amber-300 bg-[#FEF3C7] text-[#B45309] shadow-xs'
              : 'border-amber-200/60 bg-[#FFFBEB] text-[#D97706] hover:scale-[1.02] hover:border-amber-300 hover:bg-[#FEF3C7] active:scale-[0.98]'
          }`}
        >
          <Gift className="h-3.5 w-3.5 flex-shrink-0 text-[#D97706]" />
          <span className="leading-none">{tNav('promotions')}</span>
        </Link>
      </li>

      {/* Trồng sâm */}
      <li className="flex items-center">
        <Link
          href="/ginseng"
          className={`inline-flex h-8 items-center justify-center px-1 text-xs leading-none font-semibold whitespace-nowrap transition-colors xl:text-sm ${
            isActive('/ginseng')
              ? 'font-bold text-emerald-800'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          {tNav('planting')}
        </Link>
      </li>

      {/* Cửa hàng */}
      <li className="flex items-center">
        <Link
          href="/products"
          className={`inline-flex h-8 items-center justify-center px-1 text-xs leading-none font-semibold whitespace-nowrap transition-colors xl:text-sm ${
            isActive('/products')
              ? 'font-bold text-emerald-800'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          {tNav('shop')}
        </Link>
      </li>

      {/* Thông tin với Dropdown */}
      <li className="group relative flex items-center">
        <button
          type="button"
          className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1 px-1 text-xs leading-none font-semibold whitespace-nowrap transition-colors xl:text-sm ${
            isNewsActive ? 'font-bold text-emerald-800' : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          <span className="leading-none">{tNav('info')}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-3 w-3 flex-shrink-0 transition-transform duration-200 group-hover:rotate-180"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div className="invisible absolute top-full left-0 z-50 mt-1 flex w-52 flex-col gap-1 rounded-2xl border border-gray-100 bg-white p-1.5 opacity-0 shadow-xl transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100">
          <Link
            href="/news"
            className={`block px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors duration-150 ${
              isNewsActive && !currentCategory
                ? 'rounded-xl bg-[#EAF5ED] font-bold text-[#2D7A4D]'
                : 'rounded-xl text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-800'
            }`}
          >
            {tNav('all')}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/news?category=${encodeURIComponent(cat)}`}
              className={`block px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors duration-150 ${
                isNewsActive && currentCategory === cat
                  ? 'rounded-xl bg-[#EAF5ED] font-bold text-[#2D7A4D]'
                  : 'rounded-xl text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-800'
              }`}
            >
              {getCategoryLabel(cat)}
            </Link>
          ))}
        </div>
      </li>

      {/* Giới thiệu */}
      <li className="flex items-center">
        <Link
          href="/about"
          className={`inline-flex h-8 items-center justify-center px-1 text-xs leading-none font-semibold whitespace-nowrap transition-colors xl:text-sm ${
            isActive('/about')
              ? 'font-bold text-emerald-800'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          {tNav('about')}
        </Link>
      </li>
    </>
  );
};
