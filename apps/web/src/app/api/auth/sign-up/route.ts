import { NextResponse } from 'next/server';
import { Env } from '@/libs/Env';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ email và mật khẩu.' },
        { status: 400 }
      );
    }

    const apiBaseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

    // Get default countryId from public country list
    let countryId = '';
    try {
      const countryRes = await fetch(`${apiBaseUrl}/v1/public/country/list?perPage=10`, {
        headers: { 'x-api-key': Env.API_KEY },
      });
      if (countryRes.ok) {
        const countryData = await countryRes.json();
        const items = countryData?.data || [];
        if (items.length > 0) {
          countryId = items[0].id;
        }
      }
    } catch (err) {
      console.error('Failed to fetch country list for sign up:', err);
    }

    const signUpRes = await fetch(`${apiBaseUrl}/v1/public/user/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Env.API_KEY,
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password,
        name: name?.trim() || undefined,
        countryId: countryId || '00000000-0000-0000-0000-000000000001',
        marketing: true,
        cookies: true,
        from: 'website',
      }),
    });

    if (!signUpRes.ok) {
      const payload = await signUpRes.json().catch(() => null);
      const errorMsg = typeof payload?.message === 'string'
        ? payload.message
        : (Array.isArray(payload?.message) ? payload.message.join(', ') : 'Đăng ký không thành công. Vui lòng kiểm tra lại.');
      return NextResponse.json(
        { message: errorMsg },
        { status: signUpRes.status }
      );
    }

    await signUpRes.json().catch(() => null);

    return NextResponse.json({
      success: true,
      message: 'Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.',
    });
  } catch (error: any) {
    console.error('Sign-up route handler error:', error);
    return NextResponse.json(
      { message: error?.message || 'Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
