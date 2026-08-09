'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApiClient } from '@/lib/ApiClient';
import { useProfileMe } from '@/hooks/queries/useProfile';
import { getCartItems, updateCartQuantity, removeFromCart, type CartItem } from '@/utils/cart';
import { useTranslations } from 'next-intl';
import { ShoppingBag, CheckCircle2, CreditCard, PackageCheck } from 'lucide-react';
import { CartStepProgress } from './cart/CartStepProgress';
import { CartStepItems } from './cart/CartStepItems';

export const CartClient = ({ locale }: { locale: string }) => {
  const t = useTranslations('cart');
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>(() => (typeof window !== 'undefined' ? getCartItems() : []));
  const { data: profile } = useProfileMe();

  useEffect(() => {
    const handleCartUpdate = () => {
      setItems(getCartItems());
    };

    window.addEventListener('cart_updated', handleCartUpdate);
    return () => window.removeEventListener('cart_updated', handleCartUpdate);
  }, []);

  // Fetch backend cart when profile is loaded
  useEffect(() => {
    if (profile) {
      fetchApiClient('/user/cart')
        .then((res) => {
          if (res.data?.items && Array.isArray(res.data.items)) {
            const apiItems: CartItem[] = res.data.items.map((it: any) => ({
              id: it.productId || it.id,
              name: it.productName || it.name || 'Sản phẩm Sâm Ngọc Linh',
              price: Number(it.price) || 0,
              quantity: Number(it.quantity) || 1,
              image: it.imageUrl || it.image,
            }));
            if (apiItems.length > 0) {
              setItems(apiItems);
              localStorage.setItem('cart_items:v1', JSON.stringify(apiItems));
            }
          }
        })
        .catch(() => {});
    }
  }, [profile]);

  const handleUpdateQuantity = (id: string, delta: number) => {
    const next = updateCartQuantity(id, delta);
    setItems(next);
  };

  const handleRemoveItem = (id: string) => {
    const next = removeFromCart(id);
    setItems(next);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const stepsList = [
    { step: 1, label: t('step1'), icon: ShoppingBag },
    { step: 2, label: t('step2'), icon: CheckCircle2 },
    { step: 3, label: t('step3'), icon: CreditCard },
    { step: 4, label: t('step4'), icon: PackageCheck },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <CartStepProgress currentStep={1} stepsList={stepsList} />

        <CartStepItems
          items={items}
          totalAmount={totalAmount}
          t={t}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onNextStep={() => router.push(`/${locale}/checkout`)}
        />
      </div>
    </div>
  );
};
