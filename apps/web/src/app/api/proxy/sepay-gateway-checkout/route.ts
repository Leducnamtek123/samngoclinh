import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  try {
    const targetUrl = request.nextUrl.searchParams.get('target') || 'https://pay-sandbox.sepay.vn/checkout';
    const parsedTarget = new URL(targetUrl);
    const originHost = `${parsedTarget.protocol}//${parsedTarget.host}`;

    const bodyText = await request.text();
    const contentType = request.headers.get('content-type') || 'application/x-www-form-urlencoded';

    const reqHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Referer': `${originHost}/`,
      'Origin': originHost,
    };

    const cookie = request.headers.get('cookie');
    if (cookie) {
      const sepayCookies = cookie
        .split(';')
        .map((c) => c.trim())
        .filter((c) => c.startsWith('sepay_') || c.startsWith('PHPSESSID') || c.startsWith('XSRF'))
        .join('; ');
      if (sepayCookies) {
        reqHeaders['Cookie'] = sepayCookies;
      }
    }

    const sepayRes = await fetch(targetUrl, {
      method: 'POST',
      headers: reqHeaders,
      body: bodyText,
      redirect: 'follow',
    });

    let resHtml = await sepayRes.text();

    // Inline JS interceptor for XHR and fetch inside the iFrame
    const interceptorScript = `
<script>
(function() {
  const originHost = ${JSON.stringify(originHost)};
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    if (typeof url === 'string') {
      if (!url.includes('/api/proxy/sepay-api-proxy')) {
        let targetUrl = url;
        if (url.startsWith('/')) {
          targetUrl = originHost + url;
        } else if (!url.startsWith('http')) {
          targetUrl = originHost + '/' + url;
        }
        url = '/api/proxy/sepay-api-proxy?target=' + encodeURIComponent(targetUrl);
      }
    }
    return origOpen.call(this, method, url, ...args);
  };

  const origFetch = window.fetch;
  if (origFetch) {
    window.fetch = function(input, init) {
      if (typeof input === 'string') {
        if (!input.includes('/api/proxy/sepay-api-proxy')) {
          let targetUrl = input;
          if (input.startsWith('/')) {
            targetUrl = originHost + input;
          } else if (!input.startsWith('http')) {
            targetUrl = originHost + '/' + input;
          }
          input = '/api/proxy/sepay-api-proxy?target=' + encodeURIComponent(targetUrl);
        }
      }
      return origFetch.call(this, input, init);
    };
  }
})();
</script>
`;

    // Rewrite stylesheet hrefs and script srcs so fonts load through sepay-api-proxy
    resHtml = resHtml.replace(/(href|src)=["']((?:https:\/\/pay-sandbox\.sepay\.vn)?\/[^"']*)["']/gi, (match, attr, path) => {
      if (path.includes('/api/proxy/sepay-api-proxy')) return match;
      const fullTarget = path.startsWith('http') ? path : `${originHost}${path.startsWith('/') ? '' : '/'}${path}`;
      return `${attr}="/api/proxy/sepay-api-proxy?target=${encodeURIComponent(fullTarget)}"`;
    });

    // Inject base href tag pointing to sepay-api-proxy and interceptor script
    const baseTag = `<base href="/api/proxy/sepay-api-proxy?target=${encodeURIComponent(originHost + '/')}" />`;
    const headInjection = `${baseTag}${interceptorScript}`;

    if (resHtml.includes('<head>')) {
      resHtml = resHtml.replace('<head>', `<head>${headInjection}`);
    } else {
      resHtml = headInjection + resHtml;
    }

    const response = new NextResponse(resHtml, {
      status: sepayRes.status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
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

    response.headers.delete('x-frame-options');
    response.headers.delete('content-security-policy');
    return response;
  } catch (err: any) {
    return new NextResponse(`Lỗi nạp SePay Gateway: ${err.message}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
}
