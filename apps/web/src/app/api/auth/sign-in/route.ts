import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, type, phone, otp } = await request.json();

    let endpoint = 'http://localhost:3000/api/v1/public/user/login/credential';
    let bodyPayload: any = {
      email,
      password,
      from: 'website',
      device: {
        fingerprint: 'customer-web-fingerprint',
      },
    };

    if (type === 'phone') {
      endpoint = 'http://localhost:3000/api/v1/public/user/login/otp/verify';
      bodyPayload = {
        phone,
        otp,
        from: 'website',
        device: {
          fingerprint: 'customer-web-fingerprint',
        },
      };
    }

    const apiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP',
      },
      body: JSON.stringify(bodyPayload),
    });

    const payload = await apiRes.json();

    if (apiRes.status >= 400 || !payload.data?.tokens?.accessToken) {
      return NextResponse.json(
        { message: payload?.message ?? 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.' },
        { status: apiRes.status }
      );
    }

    const token = payload.data.tokens.accessToken;

    let userEmail = '';
    const parts = token.split('.');
    if (parts.length === 3) {
      try {
        const decodedPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        userEmail = decodedPayload.email || '';
      } catch (e) {
        console.error('Failed to decode JWT token payload:', e);
      }
    }

    // Set secure cookie
    const response = NextResponse.json({ success: true, email: userEmail, message: 'Đăng nhập thành công' });
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
