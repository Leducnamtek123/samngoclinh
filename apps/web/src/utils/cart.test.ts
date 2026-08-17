import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCartItems,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartCount,
} from './cart';

describe('cartUtils', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    global.window = {
      location: { origin: 'http://localhost:3000', pathname: '/', search: '' },
    } as unknown as Window & typeof globalThis;
    global.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: {} })));
    global.localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      length: 0,
      key: () => null,
    };
  });

  it('should initialize with empty cart items', () => {
    expect(getCartItems()).toStrictEqual([]);
    expect(getCartCount()).toBe(0);
  });

  it('should add new item to cart', () => {
    const item = {
      id: 'P-1',
      name: 'Rượu Sâm Ngọc Linh Premium',
      price: 1_500_000,
      image: '/assets/images/product.png',
      category: 'Rượu Sâm',
    };

    addToCart(item);

    const items = getCartItems();
    expect(items).toHaveLength(1);
    expect(items[0]!.id).toBe('P-1');
    expect(items[0]!.quantity).toBe(1);
    expect(getCartCount()).toBe(1);
  });

  it('should increment quantity when adding existing item', () => {
    const item = {
      id: 'P-1',
      name: 'Rượu Sâm Ngọc Linh Premium',
      price: 1_500_000,
    };

    addToCart(item);
    addToCart(item);

    const items = getCartItems();
    expect(items).toHaveLength(1);
    expect(items[0]!.quantity).toBe(2);
    expect(getCartCount()).toBe(2);
  });

  it('should update quantity of existing item', () => {
    const item = { id: 'P-1', name: 'Rượu Sâm', price: 500_000 };
    addToCart(item);

    updateCartQuantity('P-1', 2);
    expect(getCartItems()[0]!.quantity).toBe(3);

    updateCartQuantity('P-1', -1);
    expect(getCartItems()[0]!.quantity).toBe(2);
  });

  it('should remove item when quantity reaches 0 or remove API called', () => {
    const item = { id: 'P-1', name: 'Rượu Sâm', price: 500_000 };
    addToCart(item);

    removeFromCart('P-1');
    expect(getCartItems()).toHaveLength(0);
  });

  it('should clear all cart items', () => {
    addToCart({ id: 'P-1', name: 'Rượu 1', price: 100 });
    addToCart({ id: 'P-2', name: 'Rượu 2', price: 200 });

    expect(getCartItems()).toHaveLength(2);

    clearCart();
    expect(getCartItems()).toStrictEqual([]);
    expect(getCartCount()).toBe(0);
  });
});
