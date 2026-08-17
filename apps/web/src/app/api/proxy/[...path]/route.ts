import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/Api';
import { API_KEY } from '@/lib/apiKey';
import { Env } from '@/lib/Env';

async function refreshTokens(refreshToken: string) {
  const baseUrl = Env.INTERNAL_API_URL || Env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const apiKey = API_KEY;

  const res = await fetch(`${baseUrl}/v1/shared/user/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!res.ok) {
    return null;
  }
  const json = await res.json();
  if (json.data?.accessToken) {
    return json.data;
  }
  return json.data?.tokens || null;
}

async function handleProxy(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  const pathStr = params.path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const endpoint = `/${pathStr}${searchParams ? `?${searchParams}` : ''}`;

  const { method } = request;
  const rawContentType = request.headers.get('content-type') || '';
  let body: BodyInit | null | undefined;
  const customHeaders: Record<string, string> = {};

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    if (rawContentType.includes('multipart/form-data')) {
      body = (await request.arrayBuffer().catch(() => undefined)) ?? undefined;
      if (rawContentType) {
        customHeaders['Content-Type'] = rawContentType;
      }
    } else {
      body = (await request.text().catch(() => undefined)) ?? undefined;
      if (rawContentType) {
        customHeaders['Content-Type'] = rawContentType;
      } else if (body) {
        customHeaders['Content-Type'] = 'application/json';
      }
    }
  }

  try {
    let res = await fetchApi(endpoint, {
      method,
      body,
      headers: customHeaders,
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
          res = await fetchApi(endpoint, {
            method,
            body,
            headers: {
              ...customHeaders,
              Authorization: `Bearer ${newTokens.accessToken}`,
            },
          });
        } else {
          refreshFailed = true;
        }
      }
    }

    const contentType = res.headers.get('content-type') || '';
    let response: NextResponse;

    if (!res.ok) {
      // Handle and forward upstream HTTP error status
      if (contentType.includes('text/html')) {
        const htmlText = await res.text().catch(() => 'Error');
        response = new NextResponse(htmlText, {
          status: res.status,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      } else {
        const errData = await res.json().catch(async () => {
          const rawText = await res.text().catch(() => '');
          return { error: rawText || res.statusText || 'Upstream Error' };
        });
        response = NextResponse.json(errData, { status: res.status });
      }
    } else if (contentType.includes('text/html')) {
      const htmlText = await res.text();
      response = new NextResponse(htmlText, {
        status: res.status,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
      response.headers.delete('x-frame-options');
      response.headers.delete('content-security-policy');
    } else if (
      contentType.includes('application/pdf') ||
      contentType.includes('image/') ||
      contentType.includes('application/octet-stream')
    ) {
      const arrayBuffer = await res.arrayBuffer();
      const headers: Record<string, string> = {
        'Content-Type': contentType,
      };
      const contentDisposition = res.headers.get('content-disposition');
      if (contentDisposition) {
        headers['Content-Disposition'] = contentDisposition;
      }
      const cacheControl = res.headers.get('cache-control');
      if (cacheControl) {
        headers['Cache-Control'] = cacheControl;
      }
      response = new NextResponse(arrayBuffer, {
        status: res.status,
        headers,
      });
    } else {
      const data = (await res.json().catch(() => ({}))) as unknown;
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
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error proxying request' },
      { status: 500 },
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
