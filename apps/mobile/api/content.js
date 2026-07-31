// Nội dung công khai (mục "Thông tin"): GET /api/public/content/articles (VERSION_NEUTRAL).
// Phân trang offset (page/perPage); chỉ lấy bài đã xuất bản.
import { apiPublic } from './auth';
import { API_BASE_NEUTRAL } from './config';

export async function fetchArticles({ page = 1, perPage = 5 } = {}) {
  const query = `page=${page}&perPage=${perPage}&status=published`;
  const data = await apiPublic(`/public/content/articles?${query}`, {
    baseUrl: API_BASE_NEUTRAL,
  });
  return Array.isArray(data) ? data : [];
}
