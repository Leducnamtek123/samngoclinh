'use client';

import { ShoppingBag, CheckCircle2, CreditCard, PackageCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore, useEffect } from 'react';
import { useProfileMe } from '@/hooks/queries/useProfile';
import { fetchApiClient } from '@/lib/ApiClient';
import { cartStore } from '@/lib/stores/useCartStore';
import { updateCartQuantity, removeFromCart } from '@/utils/cart';
import type { CartItem } from '@/utils/cart';
import { CartStepItems } from './cart/CartStepItems';
import { CartStepProgress } from './cart/CartStepProgress';

const emptyCartItems: CartItem[] = [];

export const CartClient = ({ locale }: { locale: string }) => {
  const t = useTranslations('cart');
  const router = useRouter();

  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    () => emptyCartItems,
  );
  const { data: profile } = useProfileMe();

  // Fetch backend cart when profile is loaded
  useEffect(() => {
    if (profile) {
      fetchApiClient('/user/cart')
        .then((res) => {
          if (res.data?.items && Array.isArray(res.data.items)) {
            const apiItems: CartItem[] = res.data.items.map(
              (it: {
                productId?: string;
                id?: string;
                productName?: string;
                name?: string;
                price?: number | string;
                quantity?: number | string;
                imageUrl?: string;
                image?: string;
              }) => ({
                id: it.productId || it.id || '',
                name: it.productName || it.name || 'Sản phẩm Sâm Ngọc Linh',
                price: Number(it.price) || 0,
                quantity: Number(it.quantity) || 1,
                image: it.imageUrl || it.image,
              }),
            );
            if (apiItems.length > 0) {
              cartStore.setItems(apiItems);
            }
          }
        })
        .catch(() => {});
    }
  }, [profile]);

  const handleUpdateQuantity = (id: string, delta: number) => {
    updateCartQuantity(id, delta);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const stepsList = [
    { step: 1, label: t('step1'), icon: ShoppingBag },
    { step: 2, label: t('step2'), icon: CheckCircle2 },
    { step: 3, label: t('step3'), icon: CreditCard },
    { step: 4, label: t('step4'), icon: PackageCheck },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-10">
        <CartStepProgress currentStep={1} stepsList={stepsList} />

        <CartStepItems
          items={items}
          totalAmount={totalAmount}
          t={t}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onNextStep={(selectedItems?: CartItem[]) => {
            if (selectedItems && selectedItems.length > 0) {
              localStorage.setItem('checkout_selected_items:v1', JSON.stringify(selectedItems));
            }
            router.push(`/${locale}/checkout`);
          }}
        />
      </div>
    </div>
  );
};
