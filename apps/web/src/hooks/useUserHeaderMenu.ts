import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/lib/I18nNavigation';
import { getCartCount } from '@/utils/cart';
import { useNotificationsList } from '@/hooks/queries/useNotifications';
import type { OrderDetailData } from '@/components/orders/OrderDetailModal';

export function useUserHeaderMenu(profile: { fullName?: string; email?: string } | null) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [cartCount, setCartCount] = useState(() => (typeof window !== 'undefined' ? getCartCount() : 0));
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetailData | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const fullName = profile?.fullName || 'Khách hàng';
  const email = profile?.email || '';
  const initial = fullName.charAt(0).toUpperCase();

  const { data: notificationsData } = useNotificationsList(true);
  const unreadNotifCount = Array.isArray(notificationsData)
    ? notificationsData.filter((n: any) => !n.read && !n.isRead).length
    : 0;

  useEffect(() => {
    const handleUpdate = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener('cart_updated', handleUpdate);
    return () => window.removeEventListener('cart_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowLangMenu(false);
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' });
      window.location.href = `/${locale}`;
    } catch (e) {
      console.error('Sign-out error:', e);
      window.location.href = `/${locale}`;
    }
  };

  const navigateToTab = (tabName: string) => {
    router.push(`/profile?tabs=${tabName}`);
    setIsOpen(false);
  };

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    const { search } = window.location;
    router.push(`${pathname}${search}`, { locale: newLocale, scroll: false });
    setIsOpen(false);
    setShowLangMenu(false);
  };

  return {
    isOpen,
    setIsOpen,
    showLangMenu,
    setShowLangMenu,
    cartCount,
    isNotifOpen,
    setIsNotifOpen,
    selectedOrder,
    setSelectedOrder,
    menuRef,
    locale,
    fullName,
    email,
    initial,
    unreadNotifCount,
    handleSignOut,
    navigateToTab,
    switchLocale,
  };
}
