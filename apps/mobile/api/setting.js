// Setting công khai (config toàn site): GET /api/public/settings/:key (VERSION_NEUTRAL).
// Backend trả default cho key trang chủ khi DB rỗng; value là chuỗi JSON -> parse ra object/array.
import { apiPublic } from './auth';
import { API_BASE_NEUTRAL } from './config';

export async function fetchSetting(key) {
  const data = await apiPublic(`/public/settings/${key}`, {
    baseUrl: API_BASE_NEUTRAL,
  });
  try {
    return data?.value ? JSON.parse(data.value) : null;
  } catch {
    return null;
  }
}
