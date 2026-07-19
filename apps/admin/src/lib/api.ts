import { getSession } from 'next-auth/react';

export async function getSessionToken() {
  try {
    const isClient = typeof window !== 'undefined';
    if (isClient) {
      const session = await getSession();
      return (session?.user as any)?.accessToken || null;
    } else {
      const getServerSessionToken = (globalThis as any).getServerSessionToken;
      if (getServerSessionToken) {
        return await getServerSessionToken();
      }
      return null;
    }
  } catch (error) {
    console.error('Error getting session token:', error);
    return null;
  }
}

const NEUTRAL_PATHS = [
  '/catalog',
  '/orders',
  '/cultivation',
  '/banners',
  '/content',
  '/settings',
  '/packages',
  '/wallet',
  '/profile',
  '/promotion',
  '/notification',
  '/identity-verification',
  '/contracts',
  '/marketplace',
  '/contacts',
  '/backoffice'
];

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = await getSessionToken();
  
  let isNeutral = false;
  for (const path of NEUTRAL_PATHS) {
    if (endpoint.includes(path)) {
      isNeutral = true;
      break;
    }
  }
    
  const isServer = typeof window === 'undefined';
  const apiBaseUrl = isServer
    ? (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://apis:3000/api')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api');
  const baseUrl = isNeutral ? apiBaseUrl : `${apiBaseUrl}/v1`;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP';

  const headers: HeadersInit = {
    'x-api-key': apiKey,
    ...(options.headers || {}),
  };

  if (options.body && typeof window !== 'undefined' && options.body instanceof FormData) {
    // Let browser set boundaries automatically
  } else {
    (headers as any)['Content-Type'] = 'application/json';
  }

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const url = `${baseUrl}${endpoint}`;
 
  return fetch(url, {
    ...options,
    headers,
  });
}
