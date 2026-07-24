import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Đăng xuất thành công' });
  response.cookies.delete('user_session');
  response.cookies.delete('user_refresh_token');
  return response;
}
