import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

async function handleCorsProxy(request: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': '*',
  };

  try {
    const rawTarget = request.nextUrl.searchParams.get('target');
    if (!rawTarget) {
      return NextResponse.json({ error: 'Missing target URL parameter' }, { status: 400, headers: corsHeaders });
    }

    const targetUrl = rawTarget;
    const parsedTarget = new URL(targetUrl);
    const originHost = `${parsedTarget.protocol}//${parsedTarget.host}`;

    const method = request.method;
    const customHeaders: Record<string, string> = {
      'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Referer': `${originHost}/`,
      'Origin': originHost,
    };

    const contentType = request.headers.get('content-type');
    if (contentType) customHeaders['Content-Type'] = contentType;

    const auth = request.headers.get('authorization');
    if (auth) customHeaders['Authorization'] = auth;

    // Forward SePay session cookies
    const cookie = request.headers.get('cookie');
    if (cookie) {
      const sepayCookies = cookie
        .split(';')
        .map((c) => c.trim())
        .filter((c) => c.startsWith('sepay_') || c.startsWith('PHPSESSID') || c.startsWith('XSRF'))
        .join('; ');
      if (sepayCookies) {
        customHeaders['Cookie'] = sepayCookies;
      }
    }

    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await request.text().catch(() => undefined);
    }

    const sepayRes = await fetch(targetUrl, {
      method,
      headers: customHeaders,
      body,
      redirect: 'follow',
    });

    const resContentType = sepayRes.headers.get('content-type') || 'text/plain';
    const resBuffer = await sepayRes.arrayBuffer();

    const response = new NextResponse(resBuffer, {
      status: sepayRes.status,
      headers: {
        'Content-Type': resContentType,
        ...corsHeaders,
      },
    });

    const setCookie = sepayRes.headers.get('set-cookie');
    if (setCookie) {
      const cleanedSetCookies = setCookie
        .split(/,(?=[^;]+;)/)
        .map((c) => {
          const cleaned = c
            .replace(/Domain=[^;]+;?/gi, '')
            .replace(/Secure;?/gi, '')
            .replace(/Path=[^;]+;?/gi, '')
            .trim();
          return `${cleaned}; Path=/; SameSite=Lax`;
        });
      cleanedSetCookies.forEach((c) => {
        response.headers.append('Set-Cookie', c);
      });
    }

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'CORS Proxy Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export {
  handleCorsProxy as GET,
  handleCorsProxy as POST,
  handleCorsProxy as PUT,
  handleCorsProxy as DELETE,
  handleCorsProxy as PATCH,
};
