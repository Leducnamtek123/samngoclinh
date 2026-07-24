// AuthContext — quản lý trạng thái đăng nhập toàn app.
//  - Mở app: đọc token đã lưu rồi XÁC THỰC VỚI SERVER (fetchProfile). Server quyết định token còn hạn.
//  - signIn(): lưu token, lấy hồ sơ, cập nhật state.
//  - signOut(): báo server thu hồi refresh token rồi xoá token cục bộ.
//  - Token hết hạn phát hiện qua 401 từ server (notifyUnauthorized).
// Các màn hình dùng hook useAuth().

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  changePassword as apiChangePassword,
  fetchProfile,
  login as apiLogin,
  logout as apiLogout,
  setUnauthorizedHandler,
  verifyLoginOtp,
} from '../api/auth';
import { clearSession, loadSession, saveSession } from '../api/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearLocal = async () => {
    await clearSession();
    setToken(null);
    setUser(null);
  };

  // Từ cặp token -> lưu, lấy hồ sơ, cập nhật state. Dùng chung cho mọi cách đăng nhập.
  const establishSession = async ({ accessToken, refreshToken }) => {
    // Lưu token trước để fetchProfile() (đi qua interceptor) đọc được từ storage.
    await saveSession({ token: accessToken, refreshToken, user: null });
    setToken(accessToken);
    const profile = await fetchProfile();
    await saveSession({ token: accessToken, refreshToken, user: profile });
    setUser(profile);
  };

  // Đăng nhập bằng email/mật khẩu.
  const signIn = async ({ email, password }) => {
    const res = await apiLogin({ email, password });
    if (res.isTwoFactorEnable && !res.accessToken) {
      const err = new Error('Tài khoản đang bật xác thực 2 lớp (2FA).');
      err.code = 'TWO_FACTOR_REQUIRED';
      throw err;
    }
    await establishSession({ accessToken: res.accessToken, refreshToken: res.refreshToken });
    return { mustChangePassword: !!res.mustChangePassword };
  };

  // Đăng nhập bằng OTP số điện thoại.
  const signInWithOtp = async ({ phone, otp }) => {
    const res = await verifyLoginOtp({ phone, otp });
    await establishSession({ accessToken: res.accessToken, refreshToken: res.refreshToken });
  };

  const signOut = async () => {
    await apiLogout();
    await clearLocal();
  };

  const changePassword = async ({ oldPassword, newPassword }) => {
    return apiChangePassword({ oldPassword, newPassword });
  };

  // Bootstrap: đọc token đã lưu, rồi để SERVER xác nhận còn hợp lệ không.
  useEffect(() => {
    (async () => {
      try {
        const session = await loadSession();
        if (!session) return;
        try {
          const profile = await fetchProfile();
          setToken(session.token);
          setUser(profile);
        } catch {
          await clearSession();
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Refresh thất bại (401) -> phiên đã chết -> chỉ xoá cục bộ.
  useEffect(() => {
    setUnauthorizedHandler(() => clearLocal());
    return () => setUnauthorizedHandler(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: !!token,
      signIn,
      signInWithOtp,
      signOut,
      changePassword,
    }),
    // Các hàm đóng gói trên setState setter + import ổn định nên không cần vào deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng bên trong <AuthProvider>');
  return ctx;
}
