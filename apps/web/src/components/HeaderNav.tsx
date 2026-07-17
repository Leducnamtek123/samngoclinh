'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/libs/I18nNavigation';

export const HeaderNav = () => {
  const pathname = usePathname();

  const links = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Khuyến mãi', href: '/campaigns/free-tree' },
    { name: 'Trồng sâm', href: '/dashboard' },
    { name: 'Cửa hàng', href: '/#shop' },
    { name: 'Thông tin', href: '/about' },
    { name: 'Ký gửi', href: '/dashboard' },
    { name: 'Giới thiệu', href: '/about' }
  ];

  const isActive = (link: { name: string; href: string }) => {
    if (!pathname) {
      return link.href === '/';
    }
    // Strip locale prefix from pathname for exact matching (e.g. /vi/dashboard -> /dashboard)
    const rawPath = pathname.replace(/^\/(vi|en)/, '') || '/';
    
    if (link.href === '/') {
      return rawPath === '/';
    }

    if (link.href.startsWith('/#')) {
      return false; // Anchor links are active when clicked, handled by browser scrolling
    }

    if (link.name === 'Ký gửi') {
      return false; // Don't highlight Consignment since it shares the dashboard URL placeholder
    }

    return rawPath === link.href;
  };

  return (
    <>
      {links.map((link, idx) => {
        const active = isActive(link);
        const isAnchor = link.href.startsWith('/#') || link.href.includes('#');

        if (isAnchor) {
          return (
            <li key={idx}>
              <a
                href={link.href}
                className={`transition-all py-1.5 px-1 border-b-2 font-semibold text-sm ${
                  active
                    ? 'text-primary border-primary font-bold'
                    : 'text-gray-600 border-transparent hover:text-primary hover:border-primary/20'
                }`}
              >
                {link.name}
              </a>
            </li>
          );
        }

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
