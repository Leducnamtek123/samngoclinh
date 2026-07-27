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
  const headers = { Accept: 'application/json', 'x-custom-lang': 'vi' };
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
    // Backend validate trả chi tiết từng field trong `errors` [{property, message}] — ưu tiên hiện chi tiết.
    let message =
      typeof payload?.message === 'string' ? payload.message : 'Đã có lỗi xảy ra, vui lòng thử lại';
    if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
      message = payload.errors
        .map((e) => e?.message)
        .filter(Boolean)
        .join('\n');
    }
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
      const tokens = await apiRequest('/shared/user/refresh', { method: 'POST', token: rt });
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
  const data = await apiRequest('/public/user/login/credential', {
    method: 'POST',
    body: { email, password, from: 'mobile', device },
  });
  return {
    isTwoFactorEnable: !!data.isTwoFactorEnable,
    accessToken: data.tokens?.accessToken ?? null,
    refreshToken: data.tokens?.refreshToken ?? null,
    mustChangePassword: !!data.mustChangePassword,
  };
}

// Đăng ký bằng email. Backend bắt buộc countryId + marketing + cookies (cờ đồng ý, không phải HTTP cookie).
// Không gửi inviteCode vì backend forbidNonWhitelisted. countryId lấy từ resolveDefaultCountryId() ở màn hình.
export async function register({ name, email, password, countryId }) {
  return apiRequest('/public/user/sign-up', {
    method: 'POST',
    body: { email, name, password, countryId, marketing: false, cookies: true, from: 'mobile' },
  });
}

// Hồ sơ người dùng hiện tại. Đi qua interceptor nên token hết hạn sẽ tự refresh.
export async function fetchProfile() {
  return withAuth((token) => apiRequest('/shared/user/profile', { token }));
}

// Quên mật khẩu: gửi email/SĐT tài khoản; backend gửi mật khẩu tạm qua email (nếu tồn tại). Luôn trả 200.
export async function requestPasswordReset({ email }) {
  return apiRequest('/public/user/password/forgot', { method: 'POST', body: { email } });
}

// Đổi mật khẩu khi đã đăng nhập.
export async function changePassword({ oldPassword, newPassword }) {
  return withAuth((token) =>
    apiRequest('/shared/user/change-password', {
      method: 'PATCH',
      body: { oldPassword, newPassword },
      token,
    })
  );
}

// Cập nhật hồ sơ (tên + giới tính + ngày sinh). Backend yêu cầu countryId; gender bắt buộc ('male' | 'female').
// birthDate ('YYYY-MM-DD') chỉ gửi khi có giá trị.
export async function updateProfile({ name, gender, countryId, birthDate }) {
  const body = { name, gender, countryId };
  if (birthDate) body.birthDate = birthDate;
  return withAuth((token) =>
    apiRequest('/shared/user/profile/update', {
      method: 'PUT',
      body,
      token,
    })
  );
}

// Thêm số điện thoại. Backend cần countryId + phoneCode + number (8-22 số).
export async function addMobileNumber({ countryId, phoneCode, number }) {
  return withAuth((token) =>
    apiRequest('/shared/user/mobile-number/add', {
      method: 'POST',
      body: { countryId, phoneCode, number },
      token,
    })
  );
}

// Xoá số điện thoại theo id.
export async function deleteMobileNumber(mobileNumberId) {
  return withAuth((token) =>
    apiRequest(`/shared/user/mobile-number/delete/${mobileNumberId}`, {
      method: 'DELETE',
      token,
    })
  );
}

// Thêm địa chỉ. detail bắt buộc; label/recipient/phone/isDefault tuỳ chọn (field trống bị bỏ khi stringify).
export async function addAddress({ detail, label, recipient, phone, isDefault }) {
  return withAuth((token) =>
    apiRequest('/shared/user/address/add', {
      method: 'POST',
      body: { detail, label, recipient, phone, isDefault },
      token,
    })
  );
}

// Xoá địa chỉ theo id.
export async function deleteAddress(addressId) {
  return withAuth((token) =>
    apiRequest(`/shared/user/address/delete/${addressId}`, {
      method: 'DELETE',
      token,
    })
  );
}

// Đăng xuất thiết bị hiện tại (best-effort): nuốt lỗi để client vẫn xoá token cục bộ.
export async function logout() {
  try {
    const token = await getToken();
    if (!token) return;
    await apiRequest('/shared/user/logout', { method: 'POST', token });
  } catch {
    // bỏ qua — đăng xuất cục bộ vẫn tiếp tục
  }
}

// Gọi endpoint PUBLIC (không cần token). Dùng cho danh mục công khai (country...).
export async function apiPublic(path, options = {}) {
  return apiRequest(path, options);
}

// Gọi API cần xác thực (đã bọc interceptor refresh). Dùng cho các API nghiệp vụ sau này.
export async function authFetch(path, options = {}) {
  return withAuth((token) => apiRequest(path, { ...options, token }));
}
