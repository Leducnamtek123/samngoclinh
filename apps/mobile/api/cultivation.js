// Trồng sâm công khai: luống (bed) theo tuổi + chi tiết luống (vườn, ngày trồng, trạng thái, lịch sử chăm sóc).
// Endpoint VERSION_NEUTRAL nên dùng base /api (không /v1).
import { apiPublic } from './auth';
import { API_BASE_NEUTRAL } from './config';

export async function fetchGardens() {
  const data = await apiPublic('/public/cultivation/gardens', {
    baseUrl: API_BASE_NEUTRAL,
  });
  return Array.isArray(data) ? data : [];
}

export async function fetchGardenPurchase(code) {
  return apiPublic(`/public/cultivation/gardens/${encodeURIComponent(code)}/purchase`, {
    baseUrl: API_BASE_NEUTRAL,
  });
}

export async function fetchBedsByAge(ageYear) {
  const data = await apiPublic(`/public/cultivation/beds?ageYear=${encodeURIComponent(ageYear)}`, {
    baseUrl: API_BASE_NEUTRAL,
  });
  return Array.isArray(data) ? data : [];
}

export async function fetchBedDetail(code) {
  return apiPublic(`/public/cultivation/beds/${encodeURIComponent(code)}`, {
    baseUrl: API_BASE_NEUTRAL,
  });
}
