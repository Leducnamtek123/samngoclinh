# Sâm Ngọc Linh — Mobile (Expo / React Native)

Ứng dụng di động (iOS / Android / Web) build bằng Expo + React Native, kết nối
tới NestJS API của Sâm Ngọc Linh.

## Cấu trúc

```
apps/mobile/
├── App.js                 # Root: điều hướng theo trạng thái đăng nhập + deep link
├── app.json               # Cấu hình Expo (tên, scheme, extra.apiBaseUrl, extra.apiKey)
├── babel.config.js
├── api/                   # Tầng gọi backend
│   ├── config.js          #   Base URL (/api/v1) + x-api-key
│   ├── secureStorage.js   #   Adapter lưu trữ theo nền tảng (SecureStore / AsyncStorage)
│   ├── storage.js         #   Lưu phiên (access/refresh token + user)
│   ├── device.js          #   Fingerprint thiết bị cho login
│   └── auth.js            #   API auth + interceptor 401 -> refresh -> retry
├── context/AuthContext.js # Trạng thái đăng nhập toàn app (hook useAuth)
├── navigation/MainTabs.js # Tab: Trang chủ / Sản phẩm / Cá nhân
├── screens/               # Login, ForgotPassword, ResetPassword, ChangePassword, Home, Products, Profile
├── components/            # PrimaryButton, FormField
└── utils/                 # theme (màu/spacing), confirm (hộp thoại xác nhận)
```

## Cấu hình backend

Endpoint mặc định `http://localhost:3000/api/v1` (đặt trong `app.json` →
`expo.extra.apiBaseUrl`). Ghi đè khi cần:

- Sửa `expo.extra.apiBaseUrl` / `expo.extra.apiKey` trong `app.json`, hoặc
- Đặt biến môi trường `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_API_KEY`.

Backend yêu cầu header `x-api-key` (dạng `key:secret`) cho mọi endpoint —
cấu hình `extra.apiKey` trước khi đăng nhập được.

Lưu ý địa chỉ khi chạy thiết bị/emulator:

- Thiết bị thật: dùng IP LAN của máy chạy backend (vd `http://192.168.1.10:3000`).
- Android emulator: `http://10.0.2.2:3000`.
- iOS simulator / web: `http://localhost:3000`.

## Chạy dev

Yêu cầu Node 20 (xem `.nvmrc`).

```bash
cd apps/mobile
pnpm install
pnpm start          # mở Expo Dev Tools; nhấn a (Android), i (iOS), w (web)
```

Nếu phiên bản package lệch với Expo SDK, chạy `npx expo install --fix`.
