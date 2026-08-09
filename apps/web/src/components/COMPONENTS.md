# COMPONENT REGISTRY & DESIGN SYSTEM ARCHITECTURE

Tài liệu này là **Single Source of Truth (SSOT)** về Component Architecture của hệ thống.

---

## 1. COMPONENT ARCHITECTURE LAYERS

| Layer | Tên Layer | Đường dẫn | Mục đích | Ví dụ |
|---|---|---|---|---|
| **Layer A** | **UI Primitives** | `@/components/ui` | Các thành phần UI cơ bản nhất (shadcn / Radix primitives). Không chứa business logic. | `Button`, `Input`, `Dialog`, `Badge`, `Card` |
| **Layer B** | **Shared / Common** | `@/components/common` | Các component dùng chung giữa các feature nhưng độc lập với domain. | `EmptyState`, `LoadingState`, `ErrorState`, `SearchInput`, `Pagination`, `DataTable` |
| **Layer C** | **Domain Components** | `@/components/[domain]` | Các component chứa domain logic nhưng tái sử dụng lại trong domain đó. | `AddressSelector`, `GinsengProductCard`, `UserCard` |
| **Layer D** | **Feature / Page** | `@/components/[feature]` | Các màn hình hoặc modal tổng hợp cho một trang / quy trình cụ thể. | `OrderDetailModal`, `SepayPaymentModal`, `CartClient` |

---

## 2. COMPONENT DISCOVERY RULE (QUY TRÌNH KHI TẠO FEATURE MỚI)

Khi phát triển một feature hoặc UI mới, **TUYỆT ĐỐI KHÔNG VIẾT RAW UI NGAY**.
Phải thực hiện đúng theo sơ đồ sau:

```
Nhu cầu UI Mới
    │
    ▼
1. Search Component Registry (COMPONENTS.md) & src/components
    │
    ├─── Đã có? ──────► REUSE (Sử dụng component có sẵn)
    │
    ▼
2. Có component gần giống?
    │
    ├─── Có thể mở rộng? ──► EXTEND (Thêm variant/prop mới vào component sẵn có)
    │
    ▼
3. Chưa có phù hợp?
    │
    ▼
4. TẠO NEW REUSABLE COMPONENT
    ├── Đưa vào đúng Layer (A, B, C hoặc D)
    ├── Export TypeScript Props rõ ràng
    ├── Đăng ký vào barrel export (`src/components/index.ts`)
    └── Đăng ký vào `COMPONENTS.md`
```

---

## 3. COMPONENT REGISTRY INVENTORY

### Layer A: UI Primitives (`@/components/ui` hoặc `@/components`)

#### `Button`
- **Location**: `@/components/ui/button.tsx`
- **Purpose**: Nút bấm tiêu chuẩn ứng dụng.
- **Props**: `variant` ('default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'), `size` ('default' | 'sm' | 'lg' | 'icon'), `isLoading`, `disabled`.
- **Do NOT create**: `CustomButton`, `PrimaryButton`, `ActionButton`, `<button>`.

#### `Input` & `FloatingInput`
- **Location**: `@/components/ui/input.tsx` & `@/components/ui/floating-input.tsx`
- **Purpose**: Thẻ nhập liệu văn bản tiêu chuẩn.
- **Do NOT create**: Raw `<input>`, custom input wrapper.

#### `Dialog` & `ConfirmModal`
- **Location**: `@/components/ui/dialog.tsx` & `@/components/ui/ConfirmModal.tsx`
- **Purpose**: Modal hộp thoại tương tác & modal xác nhận action.
- **Do NOT create**: Custom absolute overlay backdrops, custom modal popups.

#### `Badge`
- **Location**: `@/components/ui/badge.tsx`
- **Purpose**: Nhãn hiển thị trạng thái, loại sản phẩm.
- **Props**: `variant` ('default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning').

#### `Card`
- **Location**: `@/components/ui/card.tsx`
- **Components**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

#### `Select`, `Tabs`, `Accordion`, `Checkbox`, `Switch`, `Textarea`
- **Location**: `@/components/ui/...`
- **Purpose**: Form controls & layout primitives chuẩn shadcn/ui.

#### Form Wrappers (`@/components/ui/form`)
- **Location**: `@/components/ui/form/...`
- **Components**: `Form`, `FormInput`, `FormFloatingInput`, `FormSelect`, `FormCheckbox`, `FormRadioGroup`, `FormSwitch`, `FormTextarea`, `FormAddressPicker`, `FormDatePicker`, `FormPhoneInput`, `FormPassword`.
- **Purpose**: Tất cả form inputs tích hợp sẵn React Hook Form + Zod validation.

---

### Layer B: Shared / Common Components (`@/components/common` hoặc `@/components`)

#### `EmptyState`
- **Location**: `@/components/common/EmptyState.tsx`
- **Purpose**: Hiển thị trạng thái rỗng khi danh sách/kết quả không có dữ liệu.
- **Props**: `title`, `description`, `icon`, `actionLabel`, `onAction`, `actionVariant`.
- **Do NOT create**: `<div className="text-center">Chưa có dữ liệu</div>`.

#### `LoadingState`
- **Location**: `@/components/common/LoadingState.tsx`
- **Purpose**: Hiển thị trạng thái đang tải (spinner inline, block centered, hoặc full overlay).
- **Props**: `message`, `size` ('sm' | 'md' | 'lg' | 'xl'), `variant` ('inline' | 'centered' | 'overlay').
- **Do NOT create**: Custom `animate-spin` loader divs trong từng file.

#### `ErrorState`
- **Location**: `@/components/common/ErrorState.tsx`
- **Purpose**: Hiển thị lỗi hệ thống / API failure kèm nút thử lại (retry).
- **Props**: `title`, `description`, `onRetry`, `retryLabel`.

#### `SearchInput`
- **Location**: `@/components/common/SearchInput.tsx`
- **Purpose**: Ô tìm kiếm chuẩn hóa kèm icon Search, nút xóa text, và hỗ trợ debounce tự động.
- **Props**: `onSearch`, `debounceMs`, `placeholder`.

#### `Pagination`
- **Location**: `@/components/common/Pagination.tsx`
- **Purpose**: Điều khiển phân trang dữ liệu.
- **Props**: `currentPage`, `totalPages`, `onPageChange`, `totalRecords`.

#### `DataTable`
- **Location**: `@/components/common/DataTable.tsx`
- **Purpose**: Bảng hiển thị dữ liệu chuẩn hóa có sẵn trạng thái LoadingState và EmptyState.
- **Props**: `data`, `columns`, `keyExtractor`, `isLoading`, `emptyTitle`.

---

### Layer C: Domain Components (`@/components/[domain]`)

- `AddressSelector` (`@/components/purchase/AddressSelector.tsx`): Chọn địa chỉ nhận hàng.
- `PlantPackageSelector` (`@/components/purchase/PlantPackageSelector.tsx`): Chọn gói cây trồng.
- `GinsengProductCard` (`@/components/ginseng/GinsengProductCard.tsx`): Thẻ sản phẩm sâm Ngọc Linh.
- `UserCard` (`@/components/account/UserCard.tsx`): Thẻ thông tin tài khoản người dùng.
- `DigitalSignatureCard` (`@/components/profile/DigitalSignatureCard.tsx`): Thẻ quản lý chữ ký số.

---

## 4. PUBLIC COMPONENT IMPORT GUIDELINE

Luôn luôn import component từ barrel export chính `@/components`:

```tsx
// ✅ ĐÚNG:
import { Button, Input, Dialog, EmptyState, LoadingState, FormInput } from '@/components';

// ❌ SAI:
import Button from '../../components/ui/button';
import { EmptyState } from '../common/EmptyState';
```
