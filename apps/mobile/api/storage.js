// Lớp lưu trữ phiên đăng nhập (access token + refresh token + user) qua secureStorage.
// Không kiểm tra hạn token ở client: token là chuỗi mờ, còn hạn hay không do SERVER quyết định.
// user chỉ là cache để hiển thị nhanh trước khi server xác nhận.

import { secureStorage } from './secureStorage';

const TOKEN_KEY = '@auth/token';
const REFRESH_KEY = '@auth/refreshToken';
const USER_KEY = '@auth/user';

export async function saveSession({ token, refreshToken, user }) {
  await Promise.all([
    secureStorage.setItem(TOKEN_KEY, token),
    secureStorage.setItem(REFRESH_KEY, refreshToken ?? ''),
    secureStorage.setItem(USER_KEY, JSON.stringify(user ?? null)),
  ]);
}

export async function loadSession() {
  const [token, refreshToken, userRaw] = await Promise.all([
    secureStorage.getItem(TOKEN_KEY),
    secureStorage.getItem(REFRESH_KEY),
    secureStorage.getItem(USER_KEY),
  ]);
  if (!token) return null;
  return {
    token,
    refreshToken: refreshToken || null,
    user: userRaw ? JSON.parse(userRaw) : null,
  };
}

export async function clearSession() {
  await Promise.all([
    secureStorage.removeItem(TOKEN_KEY),
    secureStorage.removeItem(REFRESH_KEY),
    secureStorage.removeItem(USER_KEY),
  ]);
}

export async function getToken() {
  return secureStorage.getItem(TOKEN_KEY);
}

export async function getRefreshToken() {
  return secureStorage.getItem(REFRESH_KEY);
}

// Cập nhật token sau khi refresh (rotation). Chỉ ghi đè giá trị được truyền.
export async function updateTokens({ token, refreshToken }) {
  const ops = [];
  if (token != null) ops.push(secureStorage.setItem(TOKEN_KEY, token));
  if (refreshToken != null) ops.push(secureStorage.setItem(REFRESH_KEY, refreshToken));
  await Promise.all(ops);
}
