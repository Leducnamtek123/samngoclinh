import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const apiRes = await fetch('http://localhost:3000/api/v1/user/login/credential', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP',
      },
      body: JSON.stringify({
        email,
        password,
        from: 'website',
        device: {
          fingerprint: 'customer-web-fingerprint',
        },
      }),
    });

    const payload = await apiRes.json();

    if (apiRes.status >= 400 || !payload.data?.tokens?.accessToken) {
      return NextResponse.json(
        { message: payload?.message ?? 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.' },
        { status: apiRes.status }
      );
    }

    const token = payload.data.tokens.accessToken;

    // Set secure cookie
    const response = NextResponse.json({ success: true, message: 'Đăng nhập thành công' });
    response.cookies.set('user_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Sign-in route handler error:', error);
    return NextResponse.json(
      { message: 'Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
