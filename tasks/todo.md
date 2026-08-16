## Phase 1: Compiler & Runtime Performance Guardrails
- [x] **Task 1.1**: Fix React Compiler Immutability Violations (`SignInForm.tsx`, `HomeFeaturedProducts.tsx`)
- [x] **Task 1.2**: Eliminate Permanent GPU `will-change` & Public Env Leak Flag (`ScrollReveal.tsx`, `Env.ts`)
- [x] **Task 1.3**: Replace Raw `<img>` with Next.js `<Image>` (`EContractModal.tsx`, `GinsengDetailClient.tsx`, `OrderDetailModal.tsx`, `DigitalSignatureCard.tsx`)
- [x] 🎯 **Checkpoint 1**: Type check & Phase 1 verification clean

## Phase 2: Performance & Data Structure Optimization
- [x] **Task 2.1**: Hoist `Intl` Formatters & Eliminate In-Render Locale Formatting (`datetime.ts`, `EContractDocumentView.tsx`, `ProfileKycTab.tsx`)
- [x] **Task 2.2**: Optimize Array Lookups in Loops to O(1) `Set`/`Map` (`CartStepItems.tsx`, `Pagination.tsx`, `ProductFilterSidebar.tsx`)
- [x] **Task 2.3**: Refactor State Initialized From Mount Effects (`useMapLocationPicker.ts`, `useUserHeaderMenu.ts`)
- [x] 🎯 **Checkpoint 2**: Type check & Phase 2 verification clean

## Phase 3: Accessibility & Form Control Integrity
- [x] **Task 3.1**: Associate Form `<label>` Elements with Control Inputs (`ProfileInfoTab.tsx`, `ProfileKycTab.tsx`, `ClaimPlantModal.tsx`, `GinsengCalculator.tsx`, `ProductDetailView.tsx`, `ProfileSettingsTab.tsx`)
- [x] **Task 3.2**: Keyboard & Interaction Handlers on Clickable Elements (`MiniCartDrawer.tsx`, `AddressModal.tsx`, `CartStepItems.tsx`, `PriceRangeSlider.tsx`)
- [x] 🎯 **Checkpoint 3**: Type check & Phase 3 verification clean

## Phase 4: Dead Code Elimination & Export Hygiene
- [x] **Task 4.1**: Clean Up Dead / Unused Exports (`date-picker.tsx`, `formatters.ts`, `orderStatus.ts`)
- [x] **Task 4.2**: Separate Non-Component Exports from Component Files (`ProfileOrdersTab.tsx` -> `orderStatus.ts`, `MemberRankBadge.tsx`)
- [x] 🎯 **Checkpoint 4**: Type check & Phase 4 verification clean

## Phase 5: State Architecture, Async Safety & Component Decomposition
- [x] **Task 5.1**: Async Re-Entry Guards & Loading Flag Cleanup (`ProfileInfoTab.tsx`, `useAddressBook.ts`, `ProfileKycTab.tsx`, `VerifyEmailModal.tsx`, `AddressModal.tsx`, `ProfileSettingsTab.tsx`)
- [x] **Task 5.2**: Refactor Effect-Driven Parent Communication & Direct Navigation (`CheckoutConfirmClient.tsx`)
- [x] 🎯 **Final Checkpoint**: `pnpm run check:types` passed (exit code 0)
