// AUTH API — gọi NestJS backend qua /api/v1/user/*.
//
// Mô hình:
//  - access token: ngắn hạn, gắn Bearer vào mỗi request cần xác thực.
//  - refresh token: dài hạn, gửi dưới dạng Bearer tới /user/refresh để xin cặp token mới (rotation).
//  - Interceptor (withAuth): gặp 401 -> tự refresh -> retry 1 lần -> vẫn fail thì đăng xuất.
//  - Mọi endpoint yêu cầu header x-api-key (@ApiKeyProtected) và trả về vỏ chuẩn { statusCode, message, data }.

import { API_BASE_URL, API_KEY } from './config';
import { getDeviceInfo } from './device';
import { getRefreshToken, getToken, updateTokens } from './storage';

// Cho phép AuthContext đăng ký hành động khi phiên hết hạn hẳn (refresh fail).
let onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}
export function notifyUnauthorized() {
  if (onUnauthorized) onUnauthorized();
}

// Lỗi HTTP có .status để interceptor nhận biết 401, .code để UI phân loại.
export class HttpError extends Error {
  constructor(status, message, code) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
  }
}

// Gọi API backend: tự parse JSON, bóc vỏ { data }, và map lỗi thành HttpError.
// KHÔNG kèm interceptor — dùng trực tiếp cho endpoint public (login, refresh, forgot/reset)
// hoặc bên trong withAuth cho endpoint cần token.
async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { Accept: 'application/json' };
  if (API_KEY) headers['x-api-key'] = API_KEY;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new HttpError(0, 'Không kết nối được máy chủ. Vui lòng kiểm tra mạng.', 'NETWORK_ERROR');
  }

  let payload = {};
  try {
    payload = await res.json();
  } catch {
    // body rỗng hoặc không phải JSON — giữ payload = {}
  }

  if (!res.ok) {
    const message =
      typeof payload?.message === 'string' ? payload.message : 'Đã có lỗi xảy ra, vui lòng thử lại';
    const code = payload?.messageProperties?.code || payload?.statusCode || `HTTP_${res.status}`;
    throw new HttpError(res.status, message, code);
  }
  return payload?.data ?? {};
}

// Single-flight: nhiều request cùng dính 401 chỉ kích hoạt MỘT lần refresh.
let refreshPromise = null;
async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const rt = await getRefreshToken();
      if (!rt) throw new HttpError(401, 'Phiên đăng nhập đã hết hạn', 'SESSION_EXPIRED');
      // Backend nhận refresh token dưới dạng Bearer (@AuthJwtRefreshProtected).
      const tokens = await apiRequest('/user/refresh', { method: 'POST', token: rt });
      await updateTokens({ token: tokens.accessToken, refreshToken: tokens.refreshToken });
      return tokens.accessToken;
    })();
    refreshPromise.catch(() => {}).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// Interceptor: bọc một lời gọi cần access token.
// 401 -> refresh -> retry đúng 1 lần -> vẫn 401/refresh fail -> đăng xuất.
async function withAuth(call) {
  const token = await getToken();
  try {
    return await call(token);
  } catch (err) {
    if (err.status !== 401) throw err;

    let newToken;
    try {
      newToken = await refreshAccessToken();
    } catch (refreshErr) {
      notifyUnauthorized();
      throw refreshErr;
    }

    try {
      return await call(newToken);
    } catch (retryErr) {
      if (retryErr.status === 401) notifyUnauthorized();
      throw retryErr;
    }
  }
}

// ---- API công khai cho UI ----

// Đăng nhập bằng email/mật khẩu. Trả về cặp token (nếu chưa bật 2FA).
export async function login({ email, password }) {
  const device = await getDeviceInfo();
  const data = await apiRequest('/user/login/credential', {
    method: 'POST',
    body: { email, password, from: 'mobile', device },
  });
  return {
    isTwoFactorEnable: !!data.isTwoFactorEnable,
    accessToken: data.tokens?.accessToken ?? null,
    refreshToken: data.tokens?.refreshToken ?? null,
  };
}

// Hồ sơ người dùng hiện tại. Đi qua interceptor nên token hết hạn sẽ tự refresh.
export async function fetchProfile() {
  return withAuth((token) => apiRequest('/user/profile', { token }));
}

// Yêu cầu gửi email khôi phục mật khẩu.
export async function requestPasswordReset({ email }) {
  return apiRequest('/user/password/forgot', { method: 'POST', body: { email } });
}

// Đặt lại mật khẩu bằng token từ link email.
export async function resetPassword({ token, newPassword }) {
  return apiRequest('/user/password/reset', { method: 'PATCH', body: { token, newPassword } });
}

// Đổi mật khẩu khi đã đăng nhập.
export async function changePassword({ oldPassword, newPassword }) {
  return withAuth((token) =>
    apiRequest('/user/change-password', {
      method: 'PATCH',
      body: { oldPassword, newPassword },
      token,
    })
  );
}

// Đăng xuất thiết bị hiện tại (best-effort): nuốt lỗi để client vẫn xoá token cục bộ.
export async function logout() {
  try {
    const token = await getToken();
    if (!token) return;
    await apiRequest('/user/logout', { method: 'POST', token });
  } catch {
    // bỏ qua — đăng xuất cục bộ vẫn tiếp tục
  }
}

// Gọi API cần xác thực (đã bọc interceptor refresh). Dùng cho các API nghiệp vụ sau này.
export async function authFetch(path, options = {}) {
  return withAuth((token) => apiRequest(path, { ...options, token }));
}
