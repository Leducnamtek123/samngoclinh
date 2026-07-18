import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/configs/next-auth';

export async function getSessionToken() {
  try {
    const isClient = typeof window !== 'undefined';
    const session = isClient 
      ? await getSession() 
      : await getServerSession(authOptions);
    return (session?.user as any)?.accessToken || null;
  } catch (error) {
    console.error('Error getting session token:', error);
    return null;
  }
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = await getSessionToken();
  
  const neutralPaths = [
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
    '/e-contract',
    '/marketplace',
    '/contacts'
  ];
  const isNeutral = neutralPaths.some(path => {
    if (path === '/profile') {
      return endpoint.includes('/profile') && !endpoint.includes('/user/profile');
    }
    return endpoint.includes(path);
  });
    
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000/api';
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
