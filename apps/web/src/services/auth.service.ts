export interface SignInRequest {
  email: string;
  password?: string;
  type?: 'email' | 'otp';
}

export interface SignInResponse {
  success: boolean;
  message?: string;
  redirectUrl?: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface SignUpResponse {
  success: boolean;
  message?: string;
}

export async function apiSignIn(payload: SignInRequest): Promise<SignInResponse> {
  const res = await fetch('/api/auth/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.');
  }

  return res.json();
}

export async function apiSignUp(payload: SignUpRequest): Promise<SignUpResponse> {
  const res = await fetch('/api/auth/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Đăng ký không thành công.');
  }

  return res.json();
}

export async function apiSignOut(): Promise<void> {
  await fetch('/api/auth/sign-out', { method: 'POST' });
}
