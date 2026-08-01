// Khuyến mãi công khai: GET /api/public/promotion/free-tree (campaign tặng cây đang mở).
// Endpoint VERSION_NEUTRAL nên dùng base /api (không /v1).
import { apiPublic } from './auth';
import { API_BASE_NEUTRAL } from './config';

export async function fetchFreeTreeCampaign() {
  const data = await apiPublic('/public/promotion/free-tree', {
    baseUrl: API_BASE_NEUTRAL,
  });
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    note: data?.note || '',
  };
}
