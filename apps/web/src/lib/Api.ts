import { cookies } from 'next/headers';
import { API_KEY } from '@/lib/apiKey';
import { Env } from '@/lib/Env';

export async function getUserSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get('user_session')?.value;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = await getUserSessionToken();
  const baseUrl = Env.INTERNAL_API_URL || Env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const apiKey = API_KEY;

  const customHeaders = (options.headers as Record<string, string>) || {};
  const headers: Record<string, string> = {
    'x-api-key': apiKey,
    ...customHeaders,
  };

  if (!customHeaders['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token && !headers.Authorization && !headers.authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${baseUrl}${endpoint}`;

  return await fetch(url, {
    ...options,
    headers,
  });
}
