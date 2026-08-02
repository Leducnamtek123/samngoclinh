// Gói chăm sóc & bảo vệ cây: GET /user/packages/care | /user/packages/protection (chỉ cần api key).
import { apiPublic } from './auth';
import { API_BASE_NEUTRAL } from './config';

export async function fetchCarePackages() {
  const data = await apiPublic('/user/packages/care', { baseUrl: API_BASE_NEUTRAL });
  return Array.isArray(data?.items) ? data.items : [];
}

export async function fetchProtectionPackages() {
  const data = await apiPublic('/user/packages/protection', { baseUrl: API_BASE_NEUTRAL });
  return Array.isArray(data?.items) ? data.items : [];
}
