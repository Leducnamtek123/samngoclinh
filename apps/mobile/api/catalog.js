// Cửa hàng công khai: GET /api/public/catalog/shop-items (paginated, search theo name/code).
// Endpoint VERSION_NEUTRAL nên dùng base /api (không /v1).
import { apiPublic } from './auth';
import { API_BASE_NEUTRAL } from './config';

export async function fetchShopItems({ search = '', page = 1, perPage = 12 } = {}) {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (search.trim()) params.set('search', search.trim());
  const data = await apiPublic(`/public/catalog/shop-items?${params.toString()}`, {
    baseUrl: API_BASE_NEUTRAL,
  });
  return Array.isArray(data) ? data : [];
}

// Chi tiết một sản phẩm (dùng cho màn chi tiết sau này).
export async function fetchShopItem(id) {
  return apiPublic(`/public/catalog/shop-items/${id}`, { baseUrl: API_BASE_NEUTRAL });
}
