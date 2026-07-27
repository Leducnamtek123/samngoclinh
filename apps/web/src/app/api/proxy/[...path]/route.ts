import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchApi } from '@/libs/Api';

async function refreshTokens(refreshToken: string) {
  const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP';

  const res = await fetch(`${baseUrl}/v1/shared/user/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'Authorization': `Bearer ${refreshToken}`,
    },
  });

  if (!res.ok) return null;
  const json = await res.json();
  if (json.data?.accessToken) return json.data;
  return json.data?.tokens || null;
}

async function handleProxy(
  request: NextRequest,
  props: { params: Promise<{ path: string[] }> }
) {
  const params = await props.params;
  const pathStr = params.path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const endpoint = `/${pathStr}${searchParams ? `?${searchParams}` : ''}`;

  const method = request.method;
  let body: string | undefined;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await request.text().catch(() => undefined);
  }

  try {
    let res = await fetchApi(endpoint, {
      method,
      body,
      headers: {
        ...(body ? { 'Content-Type': request.headers.get('Content-Type') || 'application/json' } : {}),
      },
    });

    const cookieStore = await cookies();
    let newTokens = null;

    // Handle 401 Unauthorized via Refresh Token Rotation
    if (res.status === 401) {
      const refreshToken = cookieStore.get('user_refresh_token')?.value;

      if (refreshToken) {
        newTokens = await refreshTokens(refreshToken);

        if (newTokens?.accessToken) {
          // Retry original request with newly issued Access Token
          const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP';
          const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

          res = await fetch(`${baseUrl}${endpoint}`, {
            method,
            body,
            headers: {
              'Content-Type': request.headers.get('Content-Type') || 'application/json',
              'x-api-key': apiKey,
              'Authorization': `Bearer ${newTokens.accessToken}`,
            },
          });
        }
      }
    }

    let data: any = {};
    if (res.ok) {
      data = await res.json().catch(() => ({}));
    } else {
      data = await res.json().catch(() => ({}));
    }
    const response = NextResponse.json(data, { status: res.status });

    // If tokens were refreshed, update cookies on response (30 days maxAge)
    if (newTokens?.accessToken) {
      const thirtyDays = 30 * 24 * 60 * 60;
      response.cookies.set('user_session', newTokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: thirtyDays,
        path: '/',
      });
      if (newTokens.refreshToken) {
        response.cookies.set('user_refresh_token', newTokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: thirtyDays,
          path: '/',
        });
      }
    } else if (res.status === 401) {
      // If refresh failed or invalid credentials, clear expired cookies
      response.cookies.delete('user_session');
      response.cookies.delete('user_refresh_token');
    }

    return response;
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || 'Error proxying request' },
      { status: 500 }
    );
  }
}

export {
  handleProxy as GET,
  handleProxy as POST,
  handleProxy as PUT,
  handleProxy as DELETE,
  handleProxy as PATCH,
};
