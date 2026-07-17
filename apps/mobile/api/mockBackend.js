// Mock backend TẠM THỜI — trả dữ liệu giả cho mọi endpoint, để app chạy khi chưa có server.
// Điểm chặn duy nhất là apiRequest() trong api/auth.js (bật bằng cờ USE_MOCK_API trong api/config.js).
// Trả về ĐÚNG phần `data` mà apiRequest bóc vỏ (không bọc { statusCode, message, data }).
import { mockUser } from '../data/mock';

const MOCK_TOKENS = { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ROUTES = {
  'POST /user/login/credential': () => ({ tokens: MOCK_TOKENS, isTwoFactorEnable: false }),
  'POST /user/login/otp/request': () => ({ sent: true }),
  'POST /user/login/otp/verify': () => ({ tokens: MOCK_TOKENS }),
  'POST /user/refresh': () => ({ ...MOCK_TOKENS }),
  'GET /user/profile': () => ({ ...mockUser }),
  'POST /user/sign-up': () => ({}),
  'PATCH /user/verify/email': () => ({}),
  'POST /user/send/email': () => ({}),
  'POST /user/password/forgot': () => ({}),
  'PATCH /user/password/reset': () => ({}),
  'PATCH /user/change-password': () => ({}),
  'POST /user/logout': () => ({}),
};

export async function mockRequest(path, method = 'GET', body) {
  await delay(300);
  const handler = ROUTES[`${method} ${path}`];
  return handler ? handler(body) : {};
}
