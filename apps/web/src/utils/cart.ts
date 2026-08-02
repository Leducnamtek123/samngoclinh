export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

const CART_KEY = 'cart_items:v1';

export const getCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(CART_KEY) || localStorage.getItem('cart_items');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const getCartCount = (): number => {
  const items = getCartItems();
  return items.reduce((acc, item) => acc + (item.quantity || 1), 0);
};

export const addToCart = (
  product: { id: string; name: string; price: number; image?: string; category?: string },
  quantity = 1,
) => {
  if (typeof window === 'undefined') return;
  const items = getCartItems();
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
      category: product.category,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart_updated'));

  // Sync background call to API if session exists
  try {
    fetch('/api/proxy/cart/item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity }),
    }).catch(() => {});
  } catch {}
};

export const updateCartQuantity = (id: string, delta: number): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const items = getCartItems();
  const next = items.flatMap((item) => {
    if (item.id === id) {
      const q = item.quantity + delta;
      return q > 0 ? [{ ...item, quantity: q }] : [];
    }
    return [item];
  });

  localStorage.setItem(CART_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('cart_updated'));
  return next;
};

export const removeFromCart = (id: string): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const items = getCartItems();
  const next = items.filter((item) => item.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('cart_updated'));
  return next;
};

export const clearCart = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem('cart_items');
  window.dispatchEvent(new Event('cart_updated'));
};
