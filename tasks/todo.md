# Danh sách Nhiệm vụ Chi tiết (Task Breakdown & Todo List)

## Phase 1: P0 Emergency Fixes (Sửa lỗi vận hành & 404 Route Alignment)

### Task 1: Fix Packages Route Mismatch in Admin & Backend
**Description:** Sửa đường dẫn gọi API sai trong `apps/admin/src/services/packages.service.ts` từ `/admin/packages/care-packages` sang `/admin/packages/care` và `/admin/packages/protection-packages` sang `/admin/packages/protection`. Đồng thời kiểm tra route path prefix trong `PackagesUserController`.

**Acceptance criteria:**
- [x] `packages.service.ts` gọi đúng endpoint `@Get('/care')` và `@Get('/protection')` của `PackagesAdminController`.
- [x] Trang Quản lý Gói (`pages/packages/page.tsx`) tải và lưu dữ liệu thành công không bị lỗi 404.

**Verification:**
- [x] TypeScript check pass trên `apps/admin`.
- [x] Manual test: Gọi route backend `/api/admin/packages/care` trả về 200 OK.

**Dependencies:** None
**Files touched:**
- `apps/admin/src/services/packages.service.ts`
- `apps/admin/src/app/[lang]/(dashboard-layout)/pages/packages/page.tsx`
**Status:** COMPLETED

---

### Task 2: Fix Settings Endpoints URL Prefix & Service
**Description:** Sửa các component cấu hình cài đặt hệ thống trong Admin (`shipping-settings-manager.tsx`, `points-settings-manager.tsx`, `general-settings-manager.tsx`) và `settings.service.ts` để gọi đúng prefix `/admin/settings` và `/admin/settings/:key`.

**Acceptance criteria:**
- [x] `shipping-settings-manager.tsx` gọi `GET/PUT /admin/settings/shipping_fee`.
- [x] `points-settings-manager.tsx` gọi `GET/PUT /admin/settings/point_rate`.
- [x] `general-settings-manager.tsx` gọi `GET/PUT /admin/settings` và `/admin/settings/:key`.
- [x] `settings.service.ts` được cập nhật đồng bộ các phương thức này.

**Verification:**
- [x] TypeScript check pass trên `apps/admin`.
- [x] Manual check: Các trang cấu hình cài đặt lưu và tải dữ liệu thành công.

**Dependencies:** None
**Files touched:**
- `apps/admin/src/types/settings.types.ts`
- `apps/admin/src/services/settings.service.ts`
- `apps/admin/src/app/[lang]/(dashboard-layout)/pages/settings/shipping/_components/shipping-settings-manager.tsx`
- `apps/admin/src/app/[lang]/(dashboard-layout)/pages/settings/points/_components/points-settings-manager.tsx`
- `apps/admin/src/app/[lang]/(dashboard-layout)/pages/settings/general/_components/general-settings-manager.tsx`
**Status:** COMPLETED

---

### Task 3: Add Missing Backend Contract Detail & Contact Delete Endpoints
**Description:** Bổ sung endpoint `GET /:id` vào `EContractAdminController` và `DELETE /:id` vào `ContactAdminController` trong `apps/api`. Cập nhật trang `contracts/[id]/page.tsx` để gọi trực tiếp `GET /admin/contracts/:id` thay vì thuật toán tìm kiếm 50 bản ghi in-memory.

**Acceptance criteria:**
- [x] `EContractAdminController` có endpoint `@Get('/:id')` trả về chi tiết hợp đồng theo ID.
- [x] `ContactAdminController` có endpoint `@Delete('/:id')` xử lý xóa liên hệ.
- [x] `contracts/[id]/page.tsx` gọi trực tiếp API `GET /admin/contracts/:id`.
- [x] `contacts-table.tsx` gọi `DELETE /admin/contacts/:id` thành công.

**Verification:**
- [x] Backend build thành công (`pnpm run typecheck` trên `apps/api`).
- [x] Gọi `GET /admin/contracts/:id` và `DELETE /admin/contacts/:id` thành công.

**Dependencies:** None
**Files touched:**
- `apps/api/src/modules/e-contract/controllers/e-contract.admin.controller.ts`
- `apps/api/src/modules/contact/repositories/contact.repository.ts`
- `apps/api/src/modules/contact/services/contact.service.ts`
- `apps/api/src/modules/contact/controllers/contact.admin.controller.ts`
- `apps/admin/src/app/[lang]/(dashboard-layout)/pages/contracts/[id]/page.tsx`
**Status:** COMPLETED

---

### Task 4: Clean up Dead Admin Auth Service Endpoints
**Description:** Loại bỏ hoặc liên kết đúng các endpoint `/api/register` và `/api/auth/verify-email` trong `auth-admin.service.ts` về đúng backend auth endpoints (`/v1/public/user/sign-up` và `/v1/public/user/verify/email`).

**Acceptance criteria:**
- [x] Không còn bất kỳ lệnh gọi fetch nào tới các route ảo không tồn tại trên Next.js.
- [x] Luồng đăng ký/xác thực email trỏ về đúng Backend NestJS endpoint.

**Verification:**
- [x] `apps/admin` không còn gọi route `/api/register` hoặc `/api/auth/verify-email`.

**Dependencies:** None
**Files touched:**
- `apps/admin/src/services/auth-admin.service.ts`
**Status:** COMPLETED

---

## ⏸️ Checkpoint 1: After Tasks 1-4 (P0 Complete)
- [x] Tất cả các lỗi 404 runtime đã được khắc phục.
- [x] Backend NestJS và Admin Next.js biên dịch không có lỗi (`typecheck` clean).
- [x] Kiểm tra xác thực các tính năng Packages, Settings, Contract Detail, Contact Delete.

---

## Phase 2: P1 Architectural Unification & Domain Service Layer

### Task 5: Unify Admin HTTP Client Layer into Singleton
**Description:** Hợp nhất `api.ts` và `api-client.ts` trong `apps/admin` thành một API Client module duy nhất có đầy đủ type safety, interceptor inject NextAuth token, chuẩn hóa error envelope và các hàm tiện ích.

**Acceptance criteria:**
- [x] Chuẩn HTTP client duy nhất và nhất quán trong `apps/admin/src/lib/`.
- [x] Tự động xử lý xác thực NextAuth JWT session mà không cần lặp code.
- [x] Chuẩn hóa lỗi từ API backend trả về qua Error instance.

**Verification:**
- [x] `pnpm run check:types` trên `apps/admin` pass 0 errors.

**Dependencies:** Tasks 1-4
**Files touched:**
- `apps/admin/src/lib/api-client.ts`
- `apps/admin/src/lib/api.ts`
**Status:** COMPLETED

---

### Task 6: Wire Orphan Services into Admin Pages & Components
**Description:** Tích hợp các domain service (`legal.service.ts`, `content.service.ts`, `settings.service.ts`) vào các trang UI tương ứng trong `apps/admin`. Loại bỏ việc các component tự gọi `fetchApi` với chuỗi endpoint hardcoded.

**Acceptance criteria:**
- [x] `pages/contracts/*` sử dụng `legalService`.
- [x] `pages/contacts/*` sử dụng `legalService`.
- [x] `pages/news/*` và `pages/banners/*` sử dụng `contentService`.
- [x] `pages/settings/*` sử dụng `settingsService`.
- [x] 0 Orphan services trong `apps/admin/src/services/`.

**Verification:**
- [x] Toàn bộ các trang trên hoạt động bình thường, dữ liệu được truyền qua service layer.

**Dependencies:** Task 5
**Files touched:**
- `apps/admin/src/services/legal.service.ts`
- `apps/admin/src/services/content.service.ts`
- `apps/admin/src/services/settings.service.ts`
- `apps/admin/src/app/[lang]/(dashboard-layout)/pages/contracts/page.tsx`
- `apps/admin/src/app/[lang]/(dashboard-layout)/pages/news/page.tsx`
- `apps/admin/src/app/[lang]/(dashboard-layout)/pages/banners/page.tsx`
- `apps/admin/src/app/[lang]/(dashboard-layout)/pages/contacts/page.tsx`
**Status:** COMPLETED

---

### Task 7: Introduce Pure Domain Service Layer in Web App
**Description:** Tạo thư mục `apps/web/src/services/` chứa các Typed Domain Services thuần túy: `catalog.service.ts`, `orders.service.ts`, `econtract.service.ts`, `cultivation.service.ts`, `wallet.service.ts`, `notification.service.ts`, `user.service.ts`, `content.service.ts`. Refactor toàn bộ React Query hooks trong `apps/web/src/hooks/queries/*` để gọi thông qua các service này.

**Acceptance criteria:**
- [x] Tạo đầy đủ 8 domain services trong `apps/web/src/services/`.
- [x] `hooks/queries/useCatalog.ts`, `useEContract.ts`, `useCultivation.ts`, `useNotifications.ts`, `useWallet.ts`, `useCheckout.ts`, `useIdentityVerification.ts`, `useProfile.ts`, `useQuickPurchase.ts`, `useUserSignature.ts`, `useVerifyEmail.ts`, `useBanner.ts`, `useAddressBook.ts`, `useProfileOrders.ts`, `useProfileUpdate.ts` gọi qua service layer.

**Verification:**
- [x] `pnpm run check:types` trên `apps/web` pass 0 errors.

**Dependencies:** None
**Files touched:**
- `apps/web/src/services/catalog.service.ts` [NEW]
- `apps/web/src/services/orders.service.ts` [NEW]
- `apps/web/src/services/econtract.service.ts` [NEW]
- `apps/web/src/services/cultivation.service.ts` [NEW]
- `apps/web/src/services/wallet.service.ts` [NEW]
- `apps/web/src/services/notification.service.ts` [NEW]
- `apps/web/src/services/user.service.ts` [NEW]
- `apps/web/src/services/content.service.ts` [NEW]
- `apps/web/src/hooks/queries/*.ts`
- `apps/web/src/hooks/*.ts`
**Status:** COMPLETED

---

### Task 8: Eliminate Direct Component API Calls in Web & Admin
**Description:** Chuyển đổi các UI components đang gọi trực tiếp `fetchApiClient` hoặc raw `fetch` (`AddressModal.tsx`, `CheckoutPaymentClient.tsx`, `ProfileChangePasswordTab.tsx`, `EContractDocumentView.tsx`) sang sử dụng Custom Hooks hoặc Domain Services.

**Acceptance criteria:**
- [x] 0 Lệnh gọi raw `fetch` hoặc trực tiếp `fetchApiClient` trong UI components.
- [x] `AddressModal` sử dụng `userService.addAddress`.
- [x] `CheckoutPaymentClient` sử dụng `paymentService.verifySepayOrder`.
- [x] `ProfileChangePasswordTab` sử dụng `userService.changePassword`.
- [x] `EContractDocumentView` sử dụng `econtractService.getTemplate`.

**Verification:**
- [x] UI các component hoạt động trơn tru, không có lỗi runtime hay broken layout.

**Dependencies:** Tasks 6, 7
**Files touched:**
- `apps/web/src/components/address/AddressModal.tsx`
- `apps/web/src/components/checkout/CheckoutPaymentClient.tsx`
- `apps/web/src/components/profile/ProfileChangePasswordTab.tsx`
- `apps/web/src/components/contract/EContractDocumentView.tsx`
**Status:** COMPLETED

---

## ⏸️ Checkpoint 2: After Tasks 5-8 (P1 Complete)
- [x] Kiến trúc phân tầng (Component -> Hook -> Domain Service -> API Client -> Backend) được thiết lập hoàn chỉnh trên cả Web và Admin.
- [x] 0 Orphan services, 0 Direct component API calls.
- [x] Tất cả các ứng dụng biên dịch thành công (`check:types` clean).

---

## Phase 3: P2/P3 Response Envelope, Contract Tests & Architecture Documentation

### Task 9: Response Envelope Unification
**Description:** Chuẩn hóa cấu trúc envelope data unpacking `{ data: ... }` / `{ items: [...] }` trên cả Web và Admin clients.

**Acceptance criteria:**
- [x] Cả hai client xử lý mượt mà và an toàn tất cả các định dạng phản hồi từ NestJS `@Response(...)` và `@ResponsePaging(...)`.

**Status:** COMPLETED

---

### Task 10: Contract Test Suite
**Description:** Viết bộ kiểm thử kiểm tra tính nhất quán hợp đồng gọi API cho Domain Services.

**Acceptance criteria:**
- [x] Viết và thực thi thành công bộ test `src/services/__tests__/services-consistency.test.ts` trên `apps/web` bằng Vitest (8/8 tests pass).

**Status:** COMPLETED

---

### Task 11: Final Architecture Documentation
**Description:** Biên soạn tài liệu kiến trúc API toàn diện (`docs/API_ARCHITECTURE.md`).

**Acceptance criteria:**
- [x] Tài liệu kiến trúc hoàn chỉnh đã được tạo tại `docs/API_ARCHITECTURE.md`.

**Status:** COMPLETED

---

## ⏸️ Checkpoint 3: Complete System Verification (P0 + P1 + P2 + P3)
- [x] Toàn bộ 11 Tasks đã hoàn thành 100%.
- [x] `pnpm run check:types` trên `apps/web` pass 0 errors.
- [x] `pnpm run check:types` trên `apps/admin` pass 0 errors.
- [x] `pnpm run typecheck` trên `apps/api` pass 0 errors.
- [x] Unit/Contract test suite pass (8/8 tests passed).

