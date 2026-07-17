import { NextRequest, NextResponse } from 'next/server';
import { fetchApi } from '@/libs/Api';

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
    const res = await fetchApi(endpoint, {
      method,
      body,
      headers: {
        ...(body ? { 'Content-Type': request.headers.get('Content-Type') || 'application/json' } : {}),
      },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
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
