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

// Global prefix `/api` + URI versioning `/v1` (khớp main.ts của backend).
export const API_BASE_URL = `${origin}/api/v1`;

// Header x-api-key bắt buộc cho mọi endpoint (@ApiKeyProtected). Giá trị dạng `key:secret`.
export const API_KEY = extra.apiKey || process.env.EXPO_PUBLIC_API_KEY || '';

// Chế độ mock TẠM THỜI: mặc định BẬT để app chạy khi chưa có backend.
// Tắt bằng app.json -> expo.extra.useMockApi = false, hoặc EXPO_PUBLIC_USE_MOCK_API=false.
export const USE_MOCK_API =
  extra.useMockApi === false || process.env.EXPO_PUBLIC_USE_MOCK_API === 'false' ? false : true;
