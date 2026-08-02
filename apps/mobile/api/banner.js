// Banner công khai theo trang: GET /api/public/banners/:pageKey (VERSION_NEUTRAL).
// Backend luôn trả về ít nhất 1 banner mặc định cho mỗi pageKey.
import { apiPublic } from './auth';
import { API_BASE_NEUTRAL } from './config';

export async function fetchBanners(pageKey) {
  const data = await apiPublic(`/public/banners/${pageKey}`, {
    baseUrl: API_BASE_NEUTRAL,
  });
  return Array.isArray(data) ? data : [];
}
