// Giỏ hàng toàn app: đồng bộ với server (/user/cart) khi đã đăng nhập; đăng xuất -> giỏ rỗng.
// Các màn dùng useCart(): count để hiện badge, add/update/remove/clear/refresh cho thao tác.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from './AuthContext';
import * as cartApi from '../api/cart';

const EMPTY = { itemsCount: 0, total: 0, empty: true, items: [] };

const CartContext = createContext(null);

function normalize(data) {
  return {
    itemsCount: data?.itemsCount ?? 0,
    total: data?.total ?? 0,
    empty: data?.empty ?? true,
    items: Array.isArray(data?.items) ? data.items : [],
  };
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(EMPTY);
      return;
    }
    setLoading(true);
    try {
      setCart(normalize(await cartApi.fetchCart()));
    } catch {
      // giữ nguyên giỏ hiện tại nếu lỗi mạng
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) refresh();
    else setCart(EMPTY);
  }, [isAuthenticated, refresh]);

  const add = useCallback(async (productId, quantity = 1) => {
    setCart(normalize(await cartApi.addToCart(productId, quantity)));
  }, []);
  const update = useCallback(async (productId, quantity) => {
    setCart(normalize(await cartApi.updateCartItem(productId, quantity)));
  }, []);
  const remove = useCallback(async (productId) => {
    setCart(normalize(await cartApi.removeCartItem(productId)));
  }, []);
  const clear = useCallback(async () => {
    setCart(normalize(await cartApi.clearCart()));
  }, []);

  const value = useMemo(
    () => ({ cart, loading, count: cart.items.length, add, update, remove, clear, refresh }),
    [cart, loading, add, update, remove, clear, refresh]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart phải dùng bên trong <CartProvider>');
  return ctx;
}
