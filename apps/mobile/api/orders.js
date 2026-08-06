// Đặt hàng (cần đăng nhập): POST /user/orders/checkout. Checkout toàn bộ giỏ hiện tại.
// Trả về đơn { code, total, subtotal, vat, shippingFee, paymentMethod, paymentQr?, ... }.
import { authFetch } from './auth';
import { API_BASE_NEUTRAL } from './config';

export async function checkout(payload) {
  return authFetch('/user/orders/checkout', {
    baseUrl: API_BASE_NEUTRAL,
    method: 'POST',
    body: payload,
  });
}

export async function fetchOrder(id) {
  return authFetch(`/user/orders/${id}`, { baseUrl: API_BASE_NEUTRAL });
}

export async function cancelOrder(id) {
  return authFetch(`/user/orders/${id}/cancel`, {
    baseUrl: API_BASE_NEUTRAL,
    method: 'PATCH',
  });
}
