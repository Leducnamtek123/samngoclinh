# SÂM NGỌC LINH - FRONTEND ↔ BACKEND API INTEGRATION ARCHITECTURE

> **Standard Architecture Specification & Integration Contract**
> Author: Senior Integration Architect Team
> Last Updated: 2026-08-17

---

## 1. Architectural Blueprint & Call Chain

Every frontend interaction across **Web Client (`apps/web`)** and **Admin Portal (`apps/admin`)** strictly conforms to the centralized 5-tier architectural flow:

```text
┌─────────────────────────────────────────────────────────┐
│                    Page / Component                     │
│  (UI rendering, Form state, Local interaction only)     │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   Hook / React Query                    │
│   (useQuery / useMutation, Cache keys, Invalidation)    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                     Domain Service                      │
│   (Pure async TS methods: catalogService, userService)  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 Centralized API Client                  │
│   (Session token injection, x-api-key, Route prefixing) │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│               NestJS Backend API Gateway                │
│    (/v1 versioned or VERSION_NEUTRAL controllers)       │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

### 2.1 Web App (`apps/web`)
```text
apps/web/src/
├── lib/
│   └── ApiClient.ts             # Centralized fetch client (token injection, error normalizing)
├── services/                    # Pure domain service layer
│   ├── auth.service.ts          # Auth, OTP, token refresh
│   ├── catalog.service.ts       # Plants and shop items catalog
│   ├── cultivation.service.ts   # Tree tracking, gardens, beds, packages
│   ├── econtract.service.ts     # Contracts signing, renewal, verification
│   ├── notification.service.ts  # In-app notifications & settings
│   ├── orders.service.ts        # Checkout, order tracking, cancellation
│   ├── user.service.ts          # Profile, eKYC, signatures, addresses
│   ├── wallet.service.ts        # Balances, transactions, points
│   └── content.service.ts       # Articles, banners, SePay verification, settings
└── hooks/
    └── queries/                 # React Query hooks calling Domain Services
        ├── useCatalog.ts
        ├── useCheckout.ts
        ├── useCultivation.ts
        ├── useEContract.ts
        ├── useIdentityVerification.ts
        ├── useNotifications.ts
        ├── useOrderDetail.ts
        ├── useProfile.ts
        ├── useQuickPurchase.ts
        ├── useUserSignature.ts
        ├── useVerifyEmail.ts
        └── useWallet.ts
```

### 2.2 Admin Portal (`apps/admin`)
```text
apps/admin/src/
├── lib/
│   ├── api.ts                   # Next.js Server & Client fetch utility
│   └── api-client.ts            # Axios singleton with normalized error interceptors
├── services/                    # Admin domain services
│   ├── auth-admin.service.ts    # Sign-up and verification
│   ├── catalog.service.ts       # Product & plant management
│   ├── content.service.ts       # Articles and Banners management
│   ├── cultivation.service.ts   # Gardens, beds, trees, care logs
│   ├── legal.service.ts         # eKYC, e-Contracts, Templates, Contacts
│   ├── orders.service.ts        # Orders management & status updates
│   ├── packages.service.ts      # Care & protection package management
│   ├── settings.service.ts      # System & fee settings
│   └── users.service.ts         # Admin user & role management
```

---

## 3. Route Prefixing & Controller Classification

| Area | Controller Type | Route Prefix | Auth Header | Example Endpoint |
|---|---|---|---|---|
| **Admin Operations** | `VERSION_NEUTRAL` | `/admin/*` | `Bearer <admin_jwt>` + `x-api-key` | `/admin/contracts/:id`, `/admin/packages/care` |
| **User Operations** | `VERSION_NEUTRAL` | `/user/*` | `Bearer <user_jwt>` + `x-api-key` | `/user/orders/checkout`, `/user/cultivation/trees` |
| **Public Operations** | `VERSION_NEUTRAL` | `/public/*` | `x-api-key` | `/public/catalog/plants`, `/public/payment/sepay/verify/:code` |
| **Shared V1 Routes** | `V1 Versioned` | `/v1/shared/*` | `Bearer <jwt>` + `x-api-key` | `/v1/shared/user/profile`, `/v1/shared/notification/list` |
| **Public V1 Routes** | `V1 Versioned` | `/v1/public/*` | `x-api-key` | `/v1/public/user/sign-up`, `/v1/public/settings/shipping_fee` |

---

## 4. Response Envelope & Error Normalization Standard

Backend endpoints return payloads wrapped by `@Response(...)` or `@ResponsePaging(...)`:

```typescript
// Single Item
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Paginated List
interface ApiPaginatedResponse<T> {
  statusCode: number;
  message: string;
  _pagination: {
    total: number;
    totalPage: number;
    page: number;
    perPage: number;
  };
  data: T[] | { items: T[] };
}
```

All domain services and clients unpack `res.data?.items || res.data || res` to guarantee safe, bulletproof client-side consumption.

---

## 5. Development & Contribution Rules

1. **NEVER** make direct `fetch()` or `axios()` calls inside React UI components or page files.
2. **ALWAYS** define any new backend endpoints in the appropriate domain service (`*.service.ts`).
3. **ALWAYS** wrap domain service calls in a dedicated React Query hook or server action.
4. **ALWAYS** verify with `pnpm run check:types` across `@samngoclinh/api`, `@samngoclinh/admin`, and `@samngoclinh/web`.
