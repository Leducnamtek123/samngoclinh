# Task List: System Standardization & Bug Fixes

## Phase 1: Critical Bug Fixes
- [x] **Task 1: Fix Tree Allocation Invariant in Orders Service**
  - File: `apps/api/src/modules/orders/services/orders.service.ts`
  - Acceptance: `where: { ownerUserId: null, ageYear: ageYear, status: 'active' }` used for tree queries.
  - Verification: Code verified and typecheck passed.
- [x] **Task 2: Fix Unused Import in Web Test Contract**
  - File: `apps/web/tests/contracts/api-services.test.ts`
  - Acceptance: Unused `vi` import removed.
  - Verification: `pnpm --filter @samngoclinh/web check:types` passed with code 0.

## Phase 2: Test Runner & Standardization
- [x] **Task 3: Lock Jest 29 & Cross-Platform Test Scripts**
  - File: `apps/api/package.json`
  - Acceptance: Jest locked to `^29.7.0`, `@types/jest` to `^29.5.14`, test script updated with `cross-env`.
  - Verification: `pnpm --filter @samngoclinh/api test` executes cleanly (6/6 suites passed).
- [x] **Task 4: Remove Legacy Brand References**
  - Files: `apps/api/src/modules/user/services/user.service.ts`, `apps/api/test/modules/e-contract/*.spec.ts`
  - Acceptance: No occurrences of `iwefarm` or `wefarm.com.vn`.
  - Verification: Grep search returns 0 matches in `apps/`.
- [x] **Task 5: Add Negative Balance Guard in Wallet Repository**
  - File: `apps/api/src/modules/wallet/repositories/wallet.repository.ts`
  - Acceptance: Rejects debit if `wallet.balancePoint + amount < 0`.
  - Verification: Typecheck & unit validation.
- [x] **Task 6: Clean Up `provider-dashboard` Module**
  - Files: `apps/api/src/modules/provider-dashboard/`
  - Acceptance: Directory removed, cultivation routes standardized to `modules.admin.cultivation`.
  - Verification: API build & typecheck passes.

## Phase 3: Final Verification Checkpoint
- [x] API Typecheck: `pnpm --filter @samngoclinh/api typecheck` (0 errors)
- [x] Admin Typecheck: `pnpm --filter @samngoclinh/admin check:types` (0 errors)
- [x] Web Typecheck: `pnpm --filter @samngoclinh/web check:types` (0 errors)
- [x] Admin Tests: `pnpm --filter @samngoclinh/admin test` (9/9 passed)
- [x] Web Tests: `pnpm --filter @samngoclinh/web test` (31/31 passed)
- [x] API Tests: `pnpm --filter @samngoclinh/api test` (74/74 passed)
