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
    const items = this.getSnapshot();
    const existingIndex = items.findIndex((i) => i.id === product.id);

    if (existingIndex > -1 && items[existingIndex]) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(items));
    emitChange();

    fetchApiClient('/user/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId: product.id, quantity }),
    }).catch(() => {});
  },

  updateQuantity(id: string, delta: number): CartItem[] {
    if (typeof window === 'undefined') return [];
    const items = this.getSnapshot();
    let targetQuantity = 0;

    const next = items.flatMap((item) => {
      if (item.id === id) {
        const q = item.quantity + delta;
        targetQuantity = q;
        return q > 0 ? [{ ...item, quantity: q }] : [];
      }
      return [item];
    });

    localStorage.setItem(CART_KEY, JSON.stringify(next));
    emitChange();

    if (targetQuantity > 0) {
      fetchApiClient(`/user/cart/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity: targetQuantity }),
      }).catch(() => {});
    } else {
      fetchApiClient(`/user/cart/items/${id}`, {
        method: 'DELETE',
      }).catch(() => {});
    }

    return next;
  },

  removeItem(id: string): CartItem[] {
    if (typeof window === 'undefined') return [];
    const items = this.getSnapshot();
    const next = items.filter((item) => item.id !== id);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    emitChange();

    fetchApiClient(`/user/cart/items/${id}`, {
      method: 'DELETE',
    }).catch(() => {});

    return next;
  },

  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem('cart_items');
    emitChange();

    fetchApiClient('/user/cart', {
      method: 'DELETE',
    }).catch(() => {});
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
