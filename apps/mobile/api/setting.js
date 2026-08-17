// Setting công khai (config toàn site): GET /api/v1/public/settings/:key.
// Backend trả default cho key trang chủ khi DB rỗng; value là chuỗi JSON -> parse ra object/array.
import { apiPublic } from './auth';

export async function fetchSetting(key) {
  const data = await apiPublic(`/public/settings/${key}`);
  try {
    return data?.value ? JSON.parse(data.value) : null;
  } catch {
    return null;
  }
}
