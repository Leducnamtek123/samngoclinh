'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/libs/I18nNavigation';

export const HeaderNav = () => {
  const pathname = usePathname();

  const links = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Khuyến mãi', href: '/campaigns/free-tree' },
    { name: 'Trồng sâm', href: '/ginseng' },
    { name: 'Cửa hàng', href: '/products' },
    { name: 'Thông tin', href: '/news' },
    { name: 'Ký gửi', href: '/trading-floor' },
    { name: 'Giới thiệu', href: '/about' }
  ];

  const isActive = (link: { name: string; href: string }) => {
    if (!pathname) {
      return link.href === '/';
    }
    const rawPath = pathname.replace(/^\/(vi|en)/, '') || '/';
    
    if (link.href === '/') {
      return rawPath === '/';
    }

    return rawPath === link.href;
  };

  return (
    <>
      {links.map((link, idx) => {
        const active = isActive(link);
        return (
          <li key={idx}>
            <Link
              href={link.href}
              className={`transition-all py-1.5 px-1 border-b-2 font-semibold text-sm ${
                active
                  ? 'text-primary border-primary font-bold'
                  : 'text-gray-600 border-transparent hover:text-primary hover:border-primary/20'
              }`}
            >
              {link.name}
            </Link>
          </li>
        );
      })}
    </>
  );
};
