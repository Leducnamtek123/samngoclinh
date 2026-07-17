import { getServerSession } from 'next-auth';
import { authOptions } from '@/configs/next-auth';

export async function getSessionToken() {
  try {
    const session = await getServerSession(authOptions);
    return (session?.user as any)?.accessToken || null;
  } catch (error) {
    console.error('Error getting session token:', error);
    return null;
  }
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = await getSessionToken();
  const baseUrl = 'http://localhost:3000/api/v1';
  const apiKey = 'local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP';

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
