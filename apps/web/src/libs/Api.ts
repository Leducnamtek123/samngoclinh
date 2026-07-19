import { cookies } from 'next/headers';

export async function getUserSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get('user_session')?.value;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = await getUserSessionToken();
  const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP';

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    ...(options.headers || {}),
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const url = `${baseUrl}${endpoint}`;

  return fetch(url, {
    ...options,
    headers,
  });
}
