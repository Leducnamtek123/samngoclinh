# NEEDTODO — Firebase Phone Auth (làm từ đầu)

Hướng dẫn step-by-step **từ tài khoản trống** để bật đăng nhập/đăng ký bằng số điện thoại.

**Cơ chế:** mobile dùng Firebase SDK gửi/nhận OTP (Firebase lo SMS). Firebase trả **ID token** → backend verify token bằng `firebase-admin` rồi find-or-create user theo SĐT. **Backend KHÔNG gửi SMS.**

> Dùng **CHUNG 1 Firebase project** cho mobile (SDK) và backend (service account). Khác project → ID token không verify được.

---

## Phase 1 — Tạo project

1. [ ] Đăng nhập https://console.firebase.google.com bằng tài khoản Google sẽ dùng.
2. [ ] **Add project** → đặt tên (vd `sam-ngoc-linh`) → Continue.
3. [ ] Google Analytics: bật hay tắt đều được → **Create project** → đợi tạo xong.

## Phase 2 — Bật Phone sign-in

4. [ ] Menu trái → **Build → Authentication** → **Get started**.
5. [ ] Tab **Sign-in method** → chọn **Phone** → **Enable** → **Save**.

## Phase 3 — Test phone numbers (tránh tốn SMS khi dev)

6. [ ] Vẫn trong **Sign-in method → Phone** → mở **Phone numbers for testing**.
7. [ ] Thêm cặp số + OTP cố định, vd `+84 900000001` = `123456` → **Add**.
   (Số này không gửi SMS thật, nhập OTP cố định là qua.)

## Phase 4 — Đăng ký app cho mobile

### Android
8. [ ] Project Overview (bánh răng) → **Project settings** → **General** → **Your apps** → **Add app → Android**.
9. [ ] Android package name: `vn.vismarttech.samngoclinh` → Register app.
10. [ ] Tải **`google-services.json`** → để vào `apps/mobile/` (dùng khi build).
11. [ ] **Bắt buộc: thêm SHA-1 & SHA-256** (thiếu → phone auth Android lỗi). Lấy fingerprint:
    - Debug (chạy local): `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
    - Build qua EAS: `eas credentials` (chọn Android) để xem/khai báo SHA.
    - Vào **Project settings → app Android → Add fingerprint**, dán cả SHA-1 và SHA-256.

### iOS
12. [ ] **Add app → iOS** → bundle ID `vn.vismarttech.samngoclinh` → Register.
13. [ ] Tải **`GoogleService-Info.plist`** → để vào `apps/mobile/`.

## Phase 5 — Service account cho BACKEND (verify ID token)

14. [ ] **Project settings → Service accounts** → **Generate new private key** → xác nhận → tải file JSON (vd `service-account.json`). **Giữ bí mật, KHÔNG commit.**
15. [ ] Backend đọc `FIREBASE_PRIVATE_KEY` dạng **base64 của DER (pkcs8)**, KHÔNG phải PEM thô (xem `apps/api/src/common/firebase/services/firebase.service.ts`). Convert `private_key` trong JSON:
    ```bash
    node -e "const k=require('./service-account.json').private_key; process.stdout.write(require('crypto').createPrivateKey(k).export({type:'pkcs8',format:'der'}).toString('base64'))"
    ```
    Copy chuỗi in ra.
16. [ ] Điền vào `apps/api/.env`:
    ```
    FIREBASE_PROJECT_ID=<project_id trong JSON>
    FIREBASE_CLIENT_EMAIL=<client_email trong JSON>
    FIREBASE_PRIVATE_KEY=<chuỗi base64 ở bước 15>
    ```
17. [ ] Restart backend. Log khởi động phải thấy `Firebase Admin SDK initialized successfully` (không còn warning "Firebase credentials not configured").

## Phase 6 — Production (khi go-live)

18. [ ] Nâng plan **Blaze** (SMS vượt free tier tính phí).
19. [ ] Cân nhắc **App Check / reCAPTCHA** chống lạm dụng.
20. [ ] Xoá test phone numbers ở Phase 3.

---

## Kiểm tra nhanh

- [ ] `FIREBASE_*` trong `apps/api/.env` đã điền, backend log init thành công.
- [ ] Gọi thử `POST /api/v1/public/user/login/firebase` với `idToken` thật từ mobile → trả về `tokens` (access/refresh).

---

## Backend — sau khi đổi schema (email nullable) + country VN

- [ ] Bật hạ tầng: `docker-compose up -d postgres redis jwks-server redis-bullboard`
- [ ] `cd apps/api && pnpm db:generate` (regenerate Prisma Client cho email nullable)
- [ ] `pnpm migration:fresh` (⚠️ `--force-reset` XÓA sạch DB rồi seed lại; country = Vietnam)
- [ ] `pnpm typecheck`

## Mobile — tích hợp Firebase SDK (bước sau)

- [ ] Firebase phone auth trên Expo cần **dev build** (Expo Go giới hạn) — dùng `@react-native-firebase/auth` hoặc `expo-firebase-recaptcha`.
- [ ] Đặt `google-services.json` (Android) / `GoogleService-Info.plist` (iOS).
- [ ] Luồng: nhập SĐT → Firebase gửi OTP → nhập OTP → nhận `idToken` → gọi `POST /api/v1/public/user/login/firebase` body `{ idToken, from: 'mobile', device }`.
