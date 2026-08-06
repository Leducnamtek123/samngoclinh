// Giỏ hàng người dùng (cần đăng nhập): /api/user/cart. Mọi hàm trả về bản tóm tắt giỏ
// { itemsCount, total, empty, items: [{ productId, productName, price, quantity, totalPrice, imageUrl }] }.
import { authFetch } from './auth';
import { API_BASE_NEUTRAL } from './config';

const base = { baseUrl: API_BASE_NEUTRAL };

export async function fetchCart() {
  return authFetch('/user/cart', base);
}

export async function addToCart(productId, quantity = 1) {
  return authFetch('/user/cart/items', { ...base, method: 'POST', body: { productId, quantity } });
}

export async function updateCartItem(productId, quantity) {
  return authFetch(`/user/cart/items/${productId}`, { ...base, method: 'PUT', body: { quantity } });
}

export async function removeCartItem(productId) {
  return authFetch(`/user/cart/items/${productId}`, { ...base, method: 'DELETE' });
}

export async function clearCart() {
  return authFetch('/user/cart', { ...base, method: 'DELETE' });
}
