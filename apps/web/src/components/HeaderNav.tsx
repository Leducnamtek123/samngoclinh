'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/libs/I18nNavigation';
import { useEffect, useState } from 'react';
import { fetchApiClient } from '@/libs/ApiClient';

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
          new Set(items.map((item: any) => item.category).filter(Boolean))
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
      <li>
        <Link
          href="/"
          className={`transition-all py-1.5 px-1 border-b-2 font-semibold text-sm ${
            isActive('/')
              ? 'text-primary border-primary font-bold'
              : 'text-gray-600 border-transparent hover:text-primary hover:border-primary/20'
          }`}
        >
          {tNav('home')}
        </Link>
      </li>

      {/* Khuyến mãi */}
      <li>
        <Link
          href="/campaigns/free-tree"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm ${
            isActive('/campaigns/free-tree')
              ? 'bg-[#FEF3C7] border border-amber-300 text-[#B45309]'
              : 'bg-[#FFFBEB] border border-amber-200/50 text-[#D97706] hover:bg-[#FEF3C7] hover:border-amber-300 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-4 h-4 text-[#D97706] flex-shrink-0"
          >
            <path fillRule="evenodd" d="M12 2.25c-1.2 0-2.228.755-2.625 1.812A3.75 3.75 0 0 0 3.75 7.5v.75H12V2.25Zm1.5 0v6h8.25v-.75a3.75 3.75 0 0 0-5.625-3.438A2.625 2.625 0 0 0 13.5 2.25ZM3 9.75h18v2.25H3V9.75Zm0 3.75h8.25v8.25H4.5A1.5 1.5 0 0 1 3 20.25v-6.75Zm9.75 8.25V13.5H21v6.75a1.5 1.5 0 0 1-1.5 1.5h-6.75Z" clipRule="evenodd" />
          </svg>
          <span>{tNav('promotions')}</span>
        </Link>
      </li>

      {/* Trồng sâm */}
      <li>
        <Link
          href="/products"
          className={`transition-all py-1.5 px-1 border-b-2 font-semibold text-sm ${
            isActive('/products')
              ? 'text-primary border-primary font-bold'
              : 'text-gray-600 border-transparent hover:text-primary hover:border-primary/20'
          }`}
        >
          {tNav('planting')}
        </Link>
      </li>

      {/* Cửa hàng */}
      <li>
        <Link
          href="/ginseng"
          className={`transition-all py-1.5 px-1 border-b-2 font-semibold text-sm ${
            isActive('/ginseng')
              ? 'text-primary border-primary font-bold'
              : 'text-gray-600 border-transparent hover:text-primary hover:border-primary/20'
          }`}
        >
          {tNav('shop')}
        </Link>
      </li>

      {/* Thông tin với Dropdown */}
      <li className="relative group py-1.5 px-1">
        <button
          className={`flex items-center gap-1 transition-all border-b-2 font-semibold text-sm cursor-pointer ${
            isNewsActive
              ? 'text-primary border-primary font-bold'
              : 'text-gray-600 border-transparent hover:text-primary hover:border-primary/20'
          }`}
        >
          <span>{tNav('info')}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute left-0 mt-2.5 w-52 rounded-2xl bg-white border border-gray-100 shadow-xl p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col gap-1">
          <Link
            href="/news"
            className={`px-3.5 py-2 text-[13px] font-semibold transition-all duration-150 block ${
              isNewsActive && !currentCategory
                ? 'bg-[#DFB043] text-gray-900 font-bold rounded-xl'
                : 'text-gray-700 hover:bg-emerald-50/50 hover:text-primary rounded-xl'
            }`}
          >
            {tNav('all')}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/news?category=${encodeURIComponent(cat)}`}
              className={`px-3.5 py-2 text-[13px] font-semibold transition-all duration-150 block ${
                isNewsActive && currentCategory === cat
                  ? 'bg-[#DFB043] text-gray-900 font-bold rounded-xl'
                  : 'text-gray-700 hover:bg-emerald-50/50 hover:text-primary rounded-xl'
              }`}
            >
              {getCategoryLabel(cat)}
            </Link>
          ))}
        </div>
      </li>

      {/* Mua bán cây */}
      <li>
        <Link
          href="/trading-floor"
          className={`transition-all py-1.5 px-1 border-b-2 font-semibold text-sm ${
            isActive('/trading-floor')
              ? 'text-primary border-primary font-bold'
              : 'text-gray-600 border-transparent hover:text-primary hover:border-primary/20'
          }`}
        >
          {tNav('consignment')}
        </Link>
      </li>

      {/* Giới thiệu */}
      <li>
        <Link
          href="/about"
          className={`transition-all py-1.5 px-1 border-b-2 font-semibold text-sm ${
            isActive('/about')
              ? 'text-primary border-primary font-bold'
              : 'text-gray-600 border-transparent hover:text-primary hover:border-primary/20'
          }`}
        >
          {tNav('about')}
        </Link>
      </li>
    </>
  );
};
