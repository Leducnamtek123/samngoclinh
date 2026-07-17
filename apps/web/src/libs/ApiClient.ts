export function getClientSessionToken() {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; user_session=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

export async function fetchApiClient(endpoint: string, options: RequestInit = {}) {
  const token = getClientSessionToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
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

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.message || 'Có lỗi xảy ra khi gọi API.');
  }

  return res.json();
}
