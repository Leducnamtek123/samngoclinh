import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchApi } from '@/lib/Api';
import { Env } from '@/lib/Env';

async function refreshTokens(refreshToken: string) {
  const baseUrl = Env.INTERNAL_API_URL || Env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const apiKey = Env.API_KEY || Env.NEXT_PUBLIC_API_KEY || '';

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
    let refreshFailed = false;

    // Handle 401 Unauthorized via Refresh Token Rotation
    if (res.status === 401) {
      const refreshToken = cookieStore.get('user_refresh_token')?.value;

      if (refreshToken) {
        newTokens = await refreshTokens(refreshToken);

        if (newTokens?.accessToken) {
          // Retry original request with newly issued Access Token
          const apiKey = Env.API_KEY || Env.NEXT_PUBLIC_API_KEY || '';
          const baseUrl = Env.INTERNAL_API_URL || Env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

          res = await fetch(`${baseUrl}${endpoint}`, {
            method,
            body,
            headers: {
              'Content-Type': request.headers.get('Content-Type') || 'application/json',
              'x-api-key': apiKey,
              'Authorization': `Bearer ${newTokens.accessToken}`,
            },
          });
        } else {
          refreshFailed = true;
        }
      }
    }

    const contentType = res.headers.get('content-type') || '';
    let response: NextResponse;

    if (contentType.includes('text/html')) {
      const htmlText = await res.text();
      response = new NextResponse(htmlText, {
        status: res.status,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    } else {
      let data: any = {};
      data = await res.json().catch(() => ({}));
      response = NextResponse.json(data, { status: res.status });
    }

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
    } else if (refreshFailed) {
      // ONLY clear cookies if refresh token attempt was made and failed
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
