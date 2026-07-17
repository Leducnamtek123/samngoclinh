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

  const isActive = (href: string) => {
    // If it's home, check if pathname ends with locale or is exactly /
    if (href === '/') {
      return pathname === '/' || pathname === '/vi' || pathname === '/en' || pathname === '/vi/' || pathname === '/en/';
    }
    // Anchor link check
    if (href.startsWith('/#')) {
      return false; // Handled client-side or inactive unless clicked
    }
    return pathname.includes(href);
  };

  return (
    <>
      {links.map((link, idx) => {
        const active = isActive(link.href);
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
