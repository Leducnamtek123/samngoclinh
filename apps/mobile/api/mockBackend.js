// Mock backend TẠM THỜI — trả dữ liệu giả cho mọi endpoint, để app chạy khi chưa có server.
// Điểm chặn duy nhất là apiRequest() trong api/auth.js (bật bằng cờ USE_MOCK_API trong api/config.js).
// Trả về ĐÚNG phần `data` mà apiRequest bóc vỏ (không bọc { statusCode, message, data }).
import { mockUser } from '../data/mock';

const MOCK_TOKENS = { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ROUTES = {
  'POST /public/user/login/credential': () => ({ tokens: MOCK_TOKENS, isTwoFactorEnable: false }),
  'POST /public/user/login/otp/send': () => ({ otp: '123456' }),
  'POST /public/user/login/otp/verify': () => ({ tokens: MOCK_TOKENS }),
  'POST /public/user/sign-up': () => ({}),
  'POST /public/user/password/forgot': () => ({}),
  'PATCH /public/user/password/reset': () => ({}),
  'GET /public/country/list': () => [
    { id: 'mock-country-vn', name: 'Việt Nam', alpha2Code: 'VN', alpha3Code: 'VNM', phoneCode: ['84'] },
  ],
  'POST /shared/user/refresh': () => ({ ...MOCK_TOKENS }),
  'GET /shared/user/profile': () => ({ ...mockUser }),
  'PATCH /shared/user/change-password': () => ({}),
  'POST /shared/user/logout': () => ({}),
};

export async function mockRequest(path, method = 'GET', body) {
  await delay(300);
  const handler = ROUTES[`${method} ${path}`];
  return handler ? handler(body) : {};
}
