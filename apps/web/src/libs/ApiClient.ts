export async function fetchApiClient(endpoint: string, options: RequestInit = {}) {
  const baseUrl = '/api/proxy';
  const url = `${baseUrl}${endpoint}`;

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const customHeaders = (options.headers as Record<string, string>) || {};
  const headers: Record<string, string> = { ...customHeaders };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Có lỗi xảy ra khi gọi API.');
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

