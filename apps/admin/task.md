# Task List - React Doctor Fixes (Pass 25)

- [x] Fix browser global read during server render (`no-unguarded-browser-global-in-render-or-hook-init`)
  - [x] Add client-side `mounted` state in `editor/index.tsx`
  - [x] Guard `appendTo` with `mounted ? document.body : undefined`
- [x] Fix Button missing explicit type (`button-has-type`)
  - [x] Add `type="button"` to the Confirm button in `feedback-components.tsx`
- [x] Clean up unused exports (`deslop/unused-export`)
  - [x] Remove `export` from `MenubarGroup` and `MenubarPortal` in `menubar.tsx`
  - [x] Remove `export` from `NavigationMenuViewport` and `NavigationMenuIndicator` in `navigation-menu.tsx`
  - [x] Remove `export` from `PopoverAnchor` in `popover.tsx`
  - [x] Remove `export` from `RatingStar` in `rating.tsx`
- [x] Verification and scan
  - [x] Run production build `pnpm run build`
  - [x] Run `npx react-doctor@latest --verbose`
