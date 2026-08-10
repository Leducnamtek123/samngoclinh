import { apiClient } from '@/lib/api-client';

export interface AdminRegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
}

export interface AdminVerifyEmailRequest {
  token?: string;
  email?: string;
}

export async function apiAdminRegister(payload: AdminRegisterRequest) {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Registration failed.');
  }

  return res.json();
}

export async function apiAdminVerifyEmail(payload: AdminVerifyEmailRequest) {
  const response = await fetch('/api/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Email verification failed.');
  }

  return response.json();
}
