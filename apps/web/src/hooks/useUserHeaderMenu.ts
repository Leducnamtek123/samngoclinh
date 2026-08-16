import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/lib/I18nNavigation';
import { getCartCount } from '@/utils/cart';
import { cartStore } from '@/lib/stores/useCartStore';
import { useNotificationsList } from '@/hooks/queries/useNotifications';
import type { OrderDetailData } from '@/components/orders/OrderDetailModal';

import { useProfileMe } from '@/hooks/queries/useProfile';

export function useUserHeaderMenu(initialProfile: { fullName?: string; email?: string; name?: string } | null) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetailData | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const { data: dynamicProfile } = useProfileMe((initialProfile as any) || undefined);
  const effectiveProfile = dynamicProfile || initialProfile;

  const displayName =
    effectiveProfile?.fullName?.trim() ||
    (effectiveProfile as any)?.name?.trim() ||
    effectiveProfile?.email?.split('@')[0] ||
    'Khách hàng';
  const email = effectiveProfile?.email || '';
  const initial = displayName.charAt(0).toUpperCase() || 'U';

  const { data: notificationsData } = useNotificationsList(true);
  const unreadNotifCount = Array.isArray(notificationsData)
    ? notificationsData.filter((n: any) => !n.read && !n.isRead).length
    : 0;

  useEffect(() => {
    setMounted(true);
    const handleUpdate = () => {
      setCartCount(getCartCount());
    };

    handleUpdate();

    window.addEventListener('cart_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    const unsubscribe = cartStore.subscribe(handleUpdate);

    return () => {
      window.removeEventListener('cart_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      unsubscribe();
    };
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
    mounted,
    isNotifOpen,
    setIsNotifOpen,
    selectedOrder,
    setSelectedOrder,
    menuRef,
    locale,
    fullName: displayName,
    email,
    initial,
    unreadNotifCount,
    handleSignOut,
    navigateToTab,
    switchLocale,
  };
}
