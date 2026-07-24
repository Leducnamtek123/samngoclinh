'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/libs/I18nNavigation';

export const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const toggleLocale = () => {
    const nextLocale = locale === 'vi' ? 'en' : 'vi';
    const { search } = window.location;
    router.push(`${pathname}${search}`, { locale: nextLocale, scroll: false });
  };

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className="h-8 w-8 rounded-full bg-gray-100/90 hover:bg-emerald-50 border border-gray-200/80 hover:border-emerald-300 shadow-xs inline-flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 flex-shrink-0"
      title={locale === 'vi' ? 'Chuyển sang English' : 'Switch to Tiếng Việt'}
      aria-label="Toggle language"
    >
      <span className="text-lg leading-none select-none">
        {locale === 'vi' ? '🇻🇳' : '🇺🇸'}
      </span>
    </button>
  );
};
