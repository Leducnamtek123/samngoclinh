'use client';

import { useSyncExternalStore } from 'react';
import { fetchApiClient } from '@/lib/ApiClient';
import type { CartItem } from '@/types';

const CART_KEY = 'cart_items:v1';

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart_updated'));
    window.dispatchEvent(new Event('storage'));
  }
}

export const cartStore = {
  getSnapshot(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CART_KEY) || localStorage.getItem('cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  subscribe(listener: () => void): () => void {
    listeners.push(listener);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY || e.key === 'cart_items') {
        emitChange();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorage);
    }
    return () => {
      listeners = listeners.filter((l) => l !== listener);
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorage);
      }
    };
  },

  addItem(
    product: { id: string; name: string; price: number; image?: string; category?: string },
    quantity = 1
  ) {
    if (typeof window === 'undefined') return;
    const previousItems = this.getSnapshot();
    const items = [...previousItems];
    const targetId = String(product.id);
    const existingIndex = items.findIndex((i) => String(i.id) === targetId);

    if (existingIndex > -1 && items[existingIndex]) {
      const currentQty = Number(items[existingIndex].quantity) || 1;
      items[existingIndex] = {
        ...items[existingIndex],
        quantity: currentQty + quantity,
        price: Number(product.price) || items[existingIndex].price,
        image: product.image || items[existingIndex].image,
      };
    } else {
      items.push({
        id: targetId,
        name: product.name,
        price: Number(product.price) || 0,
        quantity: Math.max(1, quantity),
        image: product.image,
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(items));
    emitChange();

    fetchApiClient('/user/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId: targetId, quantity }),
    }).catch((error) => {
      // Log warning but keep local cart additions in localStorage for guest/offline users
      console.warn('Backend cart sync skipped or failed; item retained in local storage.', error);
    });
  },

  updateQuantity(id: string, delta: number): CartItem[] {
    if (typeof window === 'undefined') return [];
    const previousItems = this.getSnapshot();
    let targetQuantity = 0;
    const targetId = String(id);

    const next = previousItems.flatMap((item) => {
      if (String(item.id) === targetId) {
        const q = (Number(item.quantity) || 1) + delta;
        targetQuantity = q;
        return q > 0 ? [{ ...item, quantity: q }] : [];
      }
      return [item];
    });

    localStorage.setItem(CART_KEY, JSON.stringify(next));
    emitChange();

    if (targetQuantity > 0) {
      fetchApiClient(`/user/cart/items/${targetId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity: targetQuantity }),
      }).catch((error) => {
        console.warn('Backend cart quantity update failed, local state retained.', error);
      });
    } else {
      fetchApiClient(`/user/cart/items/${targetId}`, {
        method: 'DELETE',
      }).catch((error) => {
        console.warn('Backend cart item delete failed, local state retained.', error);
      });
    }

    return next;
  },

  removeItem(id: string): CartItem[] {
    if (typeof window === 'undefined') return [];
    const targetId = String(id);
    const previousItems = this.getSnapshot();
    const next = previousItems.filter((item) => String(item.id) !== targetId);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    emitChange();

    fetchApiClient(`/user/cart/items/${targetId}`, {
      method: 'DELETE',
    }).catch((error) => {
      console.warn('Backend cart item remove failed, local state retained.', error);
    });

    return next;
  },

  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem('cart_items');
    emitChange();

    fetchApiClient('/user/cart', {
      method: 'DELETE',
    }).catch((error) => {
      console.warn('Backend cart clear failed, local state cleared.', error);
    });
  },
};

export function useCart() {
  const items = useSyncExternalStore(
    (listener) => cartStore.subscribe(listener),
    () => cartStore.getSnapshot(),
    () => []
  );

  const cartCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return {
    items,
    cartCount,
    totalAmount,
    addToCart: (product: { id: string; name: string; price: number; image?: string }, quantity = 1) =>
      cartStore.addItem(product, quantity),
    updateQuantity: (id: string, delta: number) => cartStore.updateQuantity(id, delta),
    removeFromCart: (id: string) => cartStore.removeItem(id),
    clearCart: () => cartStore.clear(),
  };
}
