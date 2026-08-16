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
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/sign-in') && !currentPath.includes('/sign-up')) {
          const localeMatch = currentPath.match(/^\/(vi|en)/);
          const locale = localeMatch ? localeMatch[1] : 'vi';
          setTimeout(() => {
            window.location.href = `/${locale}/sign-in?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
          }, 1200);
        }
      }
      throw new Error('Phiên đăng nhập đã hết hạn. Đang chuyển hướng đến trang đăng nhập...');
    }
    throw new Error(data.message || data.error || 'Có lỗi xảy ra khi gọi API.');
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

