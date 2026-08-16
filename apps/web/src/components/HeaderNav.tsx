'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/I18nNavigation';
import { useEffect, useState } from 'react';
import { fetchApiClient } from '@/lib/ApiClient';
import { Gift } from 'lucide-react';

export const HeaderNav = () => {
  const tNav = useTranslations('nav');
  const tCat = useTranslations('categories');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get('category') || '';

  const getCategoryLabel = (category: string) => {
    try {
      return tCat(category as any);
    } catch {
      return category;
    }
  };

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchApiClient('/public/content/articles');
        const items = data.data || [];
        const uniqueCategories: string[] = Array.from(
          new Set(items.flatMap((item: any) => item.category ? [item.category] : []))
        ) as string[];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Failed to load categories for header nav:', err);
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
          className={`h-8 px-1 inline-flex items-center justify-center font-semibold text-xs xl:text-sm leading-none whitespace-nowrap transition-colors ${
            isActive('/')
              ? 'text-emerald-800 font-bold'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          {tNav('home')}
        </Link>
      </li>

      {/* Khuyến mãi */}
      <li className="flex items-center">
        <Link
          href="/campaigns/free-tree"
          className={`h-8 px-3 rounded-full inline-flex items-center justify-center gap-1.5 text-xs font-bold leading-none transition-colors whitespace-nowrap flex-shrink-0 border ${
            isActive('/campaigns/free-tree')
              ? 'bg-[#FEF3C7] border-amber-300 text-[#B45309] shadow-xs'
              : 'bg-[#FFFBEB] border-amber-200/60 text-[#D97706] hover:bg-[#FEF3C7] hover:border-amber-300 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <Gift className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0" />
          <span className="leading-none">{tNav('promotions')}</span>
        </Link>
      </li>

      {/* Trồng sâm */}
      <li className="flex items-center">
        <Link
          href="/ginseng"
          className={`h-8 px-1 inline-flex items-center justify-center font-semibold text-xs xl:text-sm leading-none whitespace-nowrap transition-colors ${
            isActive('/ginseng')
              ? 'text-emerald-800 font-bold'
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
          className={`h-8 px-1 inline-flex items-center justify-center font-semibold text-xs xl:text-sm leading-none whitespace-nowrap transition-colors ${
            isActive('/products')
              ? 'text-emerald-800 font-bold'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          {tNav('shop')}
        </Link>
      </li>

      {/* Thông tin với Dropdown */}
      <li className="relative group flex items-center">
        <button
          type="button"
          className={`h-8 px-1 inline-flex items-center justify-center gap-1 font-semibold text-xs xl:text-sm leading-none cursor-pointer whitespace-nowrap transition-colors ${
            isNewsActive
              ? 'text-emerald-800 font-bold'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          <span className="leading-none">{tNav('info')}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200 flex-shrink-0"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute left-0 top-full mt-1 w-52 rounded-2xl bg-white border border-gray-100 shadow-xl p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,visibility] duration-200 z-50 flex flex-col gap-1">
          <Link
            href="/news"
            className={`px-3.5 py-2 text-[13px] font-semibold transition-colors duration-150 block whitespace-nowrap ${
              isNewsActive && !currentCategory
                ? 'bg-[#EAF5ED] text-[#2D7A4D] font-bold rounded-xl'
                : 'text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-800 rounded-xl'
            }`}
          >
            {tNav('all')}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/news?category=${encodeURIComponent(cat)}`}
              className={`px-3.5 py-2 text-[13px] font-semibold transition-colors duration-150 block whitespace-nowrap ${
                isNewsActive && currentCategory === cat
                  ? 'bg-[#EAF5ED] text-[#2D7A4D] font-bold rounded-xl'
                  : 'text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-800 rounded-xl'
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
          className={`h-8 px-1 inline-flex items-center justify-center font-semibold text-xs xl:text-sm leading-none whitespace-nowrap transition-colors ${
            isActive('/about')
              ? 'text-emerald-800 font-bold'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          {tNav('about')}
        </Link>
      </li>
    </>
  );
};
