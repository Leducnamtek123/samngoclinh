# Sâm Ngọc Linh (iWE FARM)

Monorepo đa nền tảng cho hệ sinh thái iWE FARM: backend API, trang quản trị, web
marketing và ứng dụng di động. Quản lý bằng PNPM workspace + Turborepo.

## Nền tảng (`apps/`)

| Thư mục | Nền tảng | Stack chính | Cổng dev |
|---|---|---|---|
| [`apps/api`](apps/api) | Backend API | NestJS v11, Prisma → PostgreSQL, Redis, BullMQ, JWT ES256/ES512 | 3000 |
| [`apps/admin`](apps/admin) | Trang quản trị | Next.js (App Router), Prisma | 3003 |
| [`apps/web`](apps/web) | Web marketing | Next.js (App Router), Drizzle | 3002 |
| [`apps/mobile`](apps/mobile) | Ứng dụng di động | Expo / React Native (iOS · Android · Web) | Expo |

## Yêu cầu

| Công cụ | Phiên bản |
|---|---|
| Node.js | ≥ 24.11.0 |
| PNPM | ≥ 10.25 (repo ghim `pnpm@10.29.2`) |
| Docker + Docker Compose | (cho hạ tầng của API: PostgreSQL, Redis) |

### Bật PNPM (một lần)

PNPM được quản lý qua **Corepack** (đi kèm Node ≥ 16). Nếu gặp `pnpm: command not found`:

```bash
corepack enable pnpm      # bật shim pnpm (dùng nvm thì không cần sudo)
```

Corepack sẽ tự tải đúng phiên bản pnpm mà repo ghim khi bạn chạy lệnh trong thư mục dự án.
Nếu Corepack không có sẵn: `npm install -g corepack@latest` rồi chạy lại lệnh trên
(hoặc cài thẳng `npm install -g pnpm@10`).

### Cài dependencies

Từ gốc repo:

```bash
pnpm install
```

## Chạy từng nền tảng

> Cài dependencies một lần từ gốc: `pnpm install`. Mọi lệnh dưới đây chạy trong thư mục của từng app.

---

### 1. Backend API — `apps/api`

**Stack:** NestJS v11 · Prisma → PostgreSQL · Redis · BullMQ · JWT ES256/ES512.
Hạ tầng (PostgreSQL, Redis, JWKS) chạy bằng Docker; API chạy trên host (hot reload).

```bash
# 1. Tạo .env + điền các secret bắt buộc (đang để trống trong .env.example)
cd apps/api
cp .env.example .env
# APP_ENCRYPTION_SECRET_KEY: chuỗi 32–64 ký tự (openssl rand -hex 24 -> 48 ký tự)
sed -i "s|^APP_ENCRYPTION_SECRET_KEY=.*|APP_ENCRYPTION_SECRET_KEY=$(openssl rand -hex 24)|" .env
sed -i "s|^AUTH_TWO_FACTOR_ENCRYPTION_KEY=.*|AUTH_TWO_FACTOR_ENCRYPTION_KEY=$(openssl rand -hex 16)|" .env
sed -i "s|^AUTH_TWO_FACTOR_ISSUER=.*|AUTH_TWO_FACTOR_ISSUER=Sam Ngoc Linh|" .env

# 2. Sinh khóa JWT (ES256/ES512), ghi thẳng vào .env
pnpm generate:keys --direct-insert

# 3. Bật hạ tầng (admin/web/apis gate bằng Docker profile → up mặc định chỉ chạy hạ tầng)
cd ../..
docker compose up -d

# 4. Prisma client + đẩy schema + seed dữ liệu
cd apps/api
pnpm db:generate
pnpm migration:fresh

# 5. Chạy API (hot reload)
pnpm dev:api
```

| | |
|---|---|
| API base | `http://localhost:3000` (route dạng `/api/v1/...`) |
| Swagger | `http://localhost:3000/docs` |
| BullMQ dashboard | `http://localhost:3010` (admin / admin123) |
| PostgreSQL | host cổng **5435** → container 5432 |

> Mọi endpoint yêu cầu header `x-api-key` (`@ApiKeyProtected`). Khóa local đã seed nằm trong `docker-compose.yml`.

> `APP_ENCRYPTION_SECRET_KEY` là khóa mã hoá AES dài **32–64 ký tự**; sinh bằng `openssl rand -hex 24` (48 ký tự) hoặc `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`. `AUTH_TWO_FACTOR_ENCRYPTION_KEY` cũng là khóa ngẫu nhiên (không chặn độ dài trên), `AUTH_TWO_FACTOR_ISSUER` là tên hiển thị trong app Authenticator. Bỏ trống các biến này → API báo `Env Variable Invalid` khi khởi động.

> `apis`, `admin`, `web` là **opt-in** qua Docker profile nên `docker compose up -d` mặc định chỉ dựng hạ tầng (`postgres`, `redis`, `jwks-server`, `redis-bullboard`). Muốn chạy chúng trong Docker: `docker compose --profile admin up -d` (tương tự `web`, `apis`); thông thường admin/web chạy local bằng `pnpm dev` (mục 2–3).
>
> Compose (v2.3.3) validate mọi `env_file` khi parse và chưa hỗ trợ `required: false`, nên các service Docker trỏ tới file luôn tồn tại: `apis` → `apps/api/.env` (tạo ở bước 1), `admin`/`web` → `.env.example` (đã commit). Nhờ vậy `docker compose up -d` chạy được ngay sau bước 1, không cần tạo `.env` cho admin/web. `jwks-server` đọc khóa JWKS từ `apps/api/keys/` (sinh ở bước 2).

> **Email (SMTP).** Gửi email (OTP xác thực email, mật khẩu tạm khi quên mật khẩu, thông báo) dùng SMTP qua nodemailer. Điền các biến sau trong `.env`; bỏ trống thì việc gửi email thất bại nhưng các luồng khác vẫn chạy.
>
> | Biến | Mặc định | Ý nghĩa |
> |---|---|---|
> | `SMTP_HOST` | *(trống)* | Host SMTP server (vd `smtp.gmail.com`) |
> | `SMTP_PORT` | `587` | Cổng SMTP (`587` cho STARTTLS, `465` cho SSL) |
> | `SMTP_SECURE` | `false` | Đặt `true` khi dùng cổng SSL `465`; để `false` cho `587` |
> | `SMTP_USER` | *(trống)* | Tài khoản đăng nhập SMTP |
> | `SMTP_PASSWORD` | *(trống)* | Mật khẩu (Gmail dùng App Password, không phải mật khẩu tài khoản) |
> | `SMTP_FROM` | *(trống)* | Địa chỉ người gửi hiển thị (vd `no-reply@iwefarm.local`) |

---

### 2. Trang quản trị — `apps/admin`

**Stack:** Next.js (App Router) · Prisma → **SQLite** (DB file cục bộ, không cần Docker).

```bash
cd apps/admin
cp .env.example .env       # DATABASE_URL mặc định = file:./dev.db
pnpm exec prisma generate  # sinh Prisma Client (fix "@prisma/client did not initialize yet")
pnpm migrate               # tạo schema vào SQLite (prisma migrate dev)
pnpm dev:admin                   # http://localhost:3003
```

> **Lỗi `@prisma/client did not initialize yet`** (kể cả sau khi `prisma generate`): do `prisma/schema.prisma` đặt `output = "../node_modules/.prisma/client"`. Trên pnpm monorepo, `@prisma/client` bị hoist lên root nên tìm client trong `.pnpm` store, còn `output` lại đẩy client sinh ra vào `apps/admin/node_modules/.prisma/client` → không khớp, nạp phải stub.
>
> Sửa gọn nhất: **bỏ dòng `output`** trong `apps/admin/prisma/schema.prisma` (để Prisma sinh đúng vị trí pnpm), rồi `pnpm exec prisma generate` và khởi động lại `pnpm dev`. Nếu buộc phải giữ `output`, tạm thời copy client thật sang `.pnpm` store: `cp -r node_modules/.prisma/client/. ../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/` (mất tác dụng sau mỗi `pnpm install`).

Env chính (trong `.env.example`): `DATABASE_URL`, `API_URL` / `NEXT_PUBLIC_API_URL` (trỏ tới backend), `NEXTAUTH_URL`, `NEXTAUTH_SECRET`.

> **Tài khoản đăng nhập** (http://localhost:3003): admin xác thực qua API nên dùng **user đã seed trong `apps/api`** (`pnpm migration:fresh`) — mật khẩu chung `aaAA@123`:
>
> | Email | Vai trò |
> |---|---|
> | `admin@mail.com` | admin |
> | `superadmin@mail.com` | superadmin |
> | `provider@mail.com` | provider |
> | `user@mail.com` | user (chỉ ở `APP_ENV=local`) |
>
> Cần API chạy ở `localhost:3000` + đã seed. Đây là tài khoản seed cho dev — đổi/xoá khi lên production. Nguồn: `apps/api/src/migration/data/migration.user.data.ts`.

---

### 3. Web marketing — `apps/web`

**Stack:** Next.js (App Router) · Drizzle → **PostgreSQL**. Chưa có `.env.example`, phải tự tạo `.env`.

Bắt buộc: `DATABASE_URL`. Tùy chọn: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` (đăng nhập), `ARCJET_KEY`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_API_KEY`.

```bash
cd apps/web
echo 'DATABASE_URL=postgresql://postgres:postgres123@localhost:5435/vismarttech' > .env
```

- **Windows:** `pnpm dev` — tự bật DB Postgres cục bộ (pglite, cổng 5433) + Next tại `http://localhost:3002`.
- **macOS / Linux:** script `dev` dùng `cmd.exe` nên **không chạy được**. Trỏ `DATABASE_URL` tới Postgres thật (vd container `postgres` của API ở cổng 5435), rồi:

  ```bash
  pnpm db:migrate      # áp migration bằng drizzle-kit
  pnpm dev:web        # Next tại http://localhost:3002
  ```

---

### 4. Ứng dụng di động — `apps/mobile`

**Stack:** Expo / React Native (iOS · Android · Web). Kết nối API qua `/api/v1` + header `x-api-key`.

```bash
cd apps/mobile
pnpm install
pnpm dev:mobile                # Expo Dev Tools: a (Android), i (iOS), w (web)
```

**Chạy qua tunnel** (test trên điện thoại thật qua internet, không cần chung wifi):

```bash
pnpm add -D @expo/ngrok@^4.1.3   # gói tunnel — chỉ cài 1 lần
pnpm tunnel                      # = expo start --tunnel; quét QR bằng Expo Go
```

> Tunnel chỉ expose Metro bundler (JS), **không** expose backend. Giữ `useMockApi: true` để app chạy đầy đủ bằng mock. Nếu cần gọi API thật trên máy thật, tunnel luôn backend (`ngrok http 3000`) rồi đặt `expo.extra.apiBaseUrl` = URL public đó.

Cấu hình backend trong [`apps/mobile/app.json`](apps/mobile/app.json) → `expo.extra` (hoặc biến `EXPO_PUBLIC_*`):

| Khóa | Ý nghĩa |
|---|---|
| `apiBaseUrl` | Mặc định `http://localhost:3000`. Thiết bị thật: IP LAN máy chạy backend; Android emulator: `http://10.0.2.2:3000`; iOS sim / web: `localhost`. |
| `apiKey` | Khóa `x-api-key` dạng `key:secret`. |
| `useMockApi` | Mặc định **bật** để app chạy được khi chưa có backend (mock toàn bộ auth). Đặt `false` để gọi API thật. |

> Nếu package lệch với Expo SDK: `npx expo install --fix`.

## Cấu trúc

```
.
├── apps/
│   ├── api/          # NestJS backend (Prisma/PostgreSQL, Redis, BullMQ)
│   ├── admin/        # Next.js admin dashboard
│   ├── web/          # Next.js web marketing
│   └── mobile/       # Expo / React Native
├── ci/               # Dockerfile các app, JWKS server, Vault
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Lệnh ở gốc (Turborepo)

```bash
pnpm dev         # chạy dev tất cả app có script dev
pnpm build       # build toàn bộ
pnpm lint        # lint toàn bộ
pnpm typecheck   # typecheck toàn bộ
```

## Tài liệu

- Backend API: xem [`apps/api/docs/`](apps/api/docs) (index tại [`apps/api/docs/readme.md`](apps/api/docs/readme.md)).
