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
| PNPM | ≥ 10.25 |
| Docker + Docker Compose | (cho hạ tầng của API: PostgreSQL, Redis) |

Cài toàn bộ workspace từ gốc repo:

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
# 1. Tạo .env
cd apps/api
cp .env.example .env

# 2. Sinh khóa JWT (ES256/ES512), ghi thẳng vào .env
pnpm generate:keys --direct-insert

# 3. Bật hạ tầng (CHỈ service backend — tránh build admin/web)
cd ../..
docker-compose up -d postgres redis jwks-server redis-bullboard

# 4. Prisma client + đẩy schema + seed dữ liệu
cd apps/api
pnpm db:generate
pnpm migration:fresh

# 5. Chạy API (hot reload)
pnpm start:dev
```

| | |
|---|---|
| API base | `http://localhost:3000` (route dạng `/api/v1/...`) |
| Swagger | `http://localhost:3000/docs` |
| BullMQ dashboard | `http://localhost:3010` (admin / admin123) |
| PostgreSQL | host cổng **5435** → container 5432 |

> Mọi endpoint yêu cầu header `x-api-key` (`@ApiKeyProtected`). Khóa local đã seed nằm trong `docker-compose.yml`.

---

### 2. Trang quản trị — `apps/admin`

**Stack:** Next.js (App Router) · Prisma → **SQLite** (DB file cục bộ, không cần Docker).

```bash
cd apps/admin
cp .env.example .env      # DATABASE_URL mặc định = file:./dev.db
pnpm migrate              # tạo schema vào SQLite (prisma migrate dev)
pnpm dev                  # http://localhost:3003
```

Env chính (trong `.env.example`): `DATABASE_URL`, `API_URL` / `NEXT_PUBLIC_API_URL` (trỏ tới backend), `NEXTAUTH_URL`, `NEXTAUTH_SECRET`.

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
  pnpm dev:next        # Next tại http://localhost:3002
  ```

---

### 4. Ứng dụng di động — `apps/mobile`

**Stack:** Expo / React Native (iOS · Android · Web). Kết nối API qua `/api/v1` + header `x-api-key`.

```bash
cd apps/mobile
pnpm install
pnpm start                # Expo Dev Tools: a (Android), i (iOS), w (web)
```

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
