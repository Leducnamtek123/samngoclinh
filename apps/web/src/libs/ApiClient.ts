export async function fetchApiClient(endpoint: string, options: RequestInit = {}) {
  const baseUrl = '/api/proxy';
  const url = `${baseUrl}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Có lỗi xảy ra khi gọi API.');
  }

  return data;
}
