// Danh mục quốc gia (public). Dùng cho đăng ký: sign-up của backend bắt buộc countryId.
import { apiPublic } from './auth';

// @note backend hiện chỉ seed Indonesia; muốn mặc định Việt Nam phải seed 'VN' ở apps/api.
export async function fetchCountries() {
  return apiPublic('/public/country/list');
}

// Trả countryId mặc định: ưu tiên Việt Nam (alpha2Code 'VN'), không có thì country đầu tiên.
export async function resolveDefaultCountryId() {
  const list = await fetchCountries();
  const items = Array.isArray(list) ? list : (list?.data ?? []);
  const vn = items.find((c) => c.alpha2Code === 'VN');
  return (vn ?? items[0])?.id ?? null;
}
