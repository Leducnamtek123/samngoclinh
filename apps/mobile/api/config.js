// Cấu hình endpoint backend (NestJS API của Sâm Ngọc Linh).
// Origin ưu tiên: app.json -> expo.extra.apiBaseUrl, rồi EXPO_PUBLIC_API_BASE_URL,
// cuối cùng là mặc định dev.
//
// Trên THIẾT BỊ THẬT phải dùng IP LAN của máy chạy backend (vd http://192.168.1.10:3000),
// KHÔNG dùng "localhost". Android emulator dùng http://10.0.2.2:3000; iOS simulator/web dùng localhost.

import Constants from 'expo-constants';

const DEFAULT_ORIGIN = 'http://localhost:3000';

const extra = Constants.expoConfig?.extra ?? {};

const origin = (
  extra.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  DEFAULT_ORIGIN
).replace(/\/+$/, '');

// Origin gốc (không kèm /api/v1) — dùng để ghép URL file tĩnh, vd ảnh /uploads/...
export const API_ORIGIN = origin;

// Global prefix `/api` + URI versioning `/v1` (khớp main.ts của backend).
export const API_BASE_URL = `${origin}/api/v1`;

// Base cho endpoint VERSION_NEUTRAL (banner, content) — chỉ `/api`, không có `/v1`.
export const API_BASE_NEUTRAL = `${origin}/api`;

// Ghép origin cho URL tương đối (/uploads, /assets); giữ nguyên URL tuyệt đối/data URL.
export function toStaticUrl(url) {
  return !url || url.startsWith('http') || url.startsWith('data:') ? url : `${origin}${url}`;
}


// Header x-api-key bắt buộc cho mọi endpoint (@ApiKeyProtected). Giá trị dạng `key:secret`.
export const API_KEY = extra.apiKey || process.env.EXPO_PUBLIC_API_KEY || '';
