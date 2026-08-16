import { cartStore } from '@/lib/stores/useCartStore';
import type { CartItem } from '@/types';

export type { CartItem };

export const getCartItems = (): CartItem[] => cartStore.getSnapshot();

export const getCartCount = (): number => {
  const items = getCartItems();
  return items.reduce((acc, item) => acc + (item.quantity || 1), 0);
};

export const addToCart = (
  product: { id: string; name: string; price: number; image?: string; category?: string },
  quantity = 1,
) => cartStore.addItem(product, quantity);

export const updateCartQuantity = (id: string, delta: number): CartItem[] => cartStore.updateQuantity(id, delta);

export const removeFromCart = (id: string): CartItem[] => cartStore.removeItem(id);

export const clearCart = () => cartStore.clear();
