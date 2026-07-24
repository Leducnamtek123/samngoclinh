import { NextResponse } from 'next/server';

import { Env } from '@/libs/Env';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    const apiBaseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const apiRes = await fetch(`${apiBaseUrl}/v1/public/user/login/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Env.API_KEY,
      },
      body: JSON.stringify({ phone }),
    });

    const payload = await apiRes.json();

    if (apiRes.status >= 400) {
      return NextResponse.json(
        { message: payload?.message ?? 'Gửi mã OTP thất bại. Vui lòng thử lại sau.' },
        { status: apiRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mã OTP đã được gửi thành công.',
      // In development/test mode, we return the generated OTP token to show on screen
      otp: payload.otp,
    });
  } catch (error) {
    console.error('Send-OTP route handler error:', error);
    return NextResponse.json(
      { message: 'Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
