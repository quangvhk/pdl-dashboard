# Pandalang — Completed Tasks

## Task 4.2: Auth Hooks ✅

**Files created:**
- `features/auth/hooks/use-login.ts` — `useLogin` mutation hook; wraps `authService.login`; on success calls `login()` on auth store (stores tokens + user + sets `auth-status` cookie), calls `setTenant()` on tenant store with `tenantId` from response, then redirects to `/dashboard` via `useRouter`.
- `features/auth/hooks/use-register.ts` — `useRegister` mutation hook; wraps `authService.register`; on success calls `login()` on auth store, calls `setTenant()` on tenant store, then redirects to `/dashboard`.
- `features/auth/hooks/use-logout.ts` — `useLogout` mutation hook; wraps `authService.logout`; uses `onSettled` (fires on both success and error) to always: call `logout()` on auth store (clears tokens + cookie), call `clearTenant()` on tenant store, call `queryClient.clear()` to wipe all React Query cache, then redirect to `/login`.
- `features/auth/hooks/use-current-user.ts` — `useCurrentUser` query hook; wraps `authService.getMe`; exports stable `currentUserQueryKey = ['auth', 'me']`; only enabled when `isAuthenticated` is true; `staleTime` 5 minutes; calls `setUser()` on auth store inside `queryFn` to keep Zustand in sync with latest server profile.

**Notes:**
- All hooks are `'use client'` — safe to use in any Client Component.
- `useLogout` uses `onSettled` instead of `onSuccess` so local state is always cleared even if the server logout endpoint fails (e.g. expired token).
- `useCurrentUser` keeps the Zustand `user` field in sync by calling `setUser` inside `queryFn` after each successful fetch.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 4.1: Auth Schemas ✅

**Files created:**
- `features/auth/schemas/login.schema.ts` — `loginSchema` Zod object; validates `email` (required + valid email format), `password` (min 1 char), `tenantSlug` (min 1 char); exports `LoginFormValues` inferred type.
- `features/auth/schemas/register.schema.ts` — `registerSchema` Zod object; validates `firstName` (min 1), `lastName` (min 1), `email` (required + valid email), `password` (min 8 chars + uppercase + lowercase + digit regex rules), `tenantSlug` (min 1); exports `RegisterFormValues` inferred type.

**Notes:**
- Both schemas use `zod` v4 imported from `'zod'`.
- Password strength rules on `registerSchema`: min 8 chars, at least one uppercase letter (`/[A-Z]/`), one lowercase letter (`/[a-z]/`), one digit (`/[0-9]/`).
- Inferred form value types (`LoginFormValues`, `RegisterFormValues`) exported for use with `react-hook-form` + `@hookform/resolvers/zod`.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 3.3: Shared Components ✅

**Files created:**
- `components/shared/page-header.tsx` — `PageHeader` client component; accepts `title`, `description`, `actions` (ReactNode), `className`; responsive flex row on `sm+` with truncated title and shrink-free actions slot.
- `components/shared/empty-state.tsx` — `EmptyState` client component; accepts `icon` (LucideIcon), `title`, `description`, `action` (label + onClick), `children`; renders dashed-border rounded container with muted icon circle, heading, description, and optional CTA `Button`.
- `components/shared/loading-skeleton.tsx` — Exports five skeleton patterns: `CardGridSkeleton` (responsive 1/2/3-col card grid), `TableSkeleton` (header + configurable rows/columns), `StatCardSkeleton` (1/2/4-col stat cards), `PageSkeleton` (header + card grid), `DetailPageSkeleton` (title + body lines + badges); all built from shadcn `Skeleton` + `Card` primitives.
- `components/shared/confirm-dialog.tsx` — `ConfirmDialog` client component wrapping `AlertDialog`; props: `open`, `onOpenChange`, `title`, `description`, `confirmLabel`, `cancelLabel`, `variant` (`default` | `destructive`), `onConfirm`, `isLoading`; disables both buttons while loading; applies `buttonVariants` to the confirm action.
- `components/shared/role-gate.tsx` — `RoleGate` client component; reads `user.roles` from `useAuthStore`; accepts `allowedRoles: Role[]` and optional `fallback`; renders `children` when user has at least one matching role, `fallback` (or nothing) otherwise.
- `components/shared/data-table.tsx` — Generic `DataTable<TRow>` client component; column definitions via `DataTableColumn<TRow>` interface (`key`, `header`, `cell`, `sortable`, `className`); built-in client-side sort (asc/desc/none toggle with `ChevronUp`/`ChevronDown`/`ChevronsUpDown` icons); optional built-in search input with `Search` icon; supports controlled `searchValue`/`onSearchChange` for server-side search; `toolbar` slot for extra controls; shows `TableSkeleton` while `isLoading`, `EmptyState` when no rows; clickable rows via `onRowClick`.
- `components/shared/pagination.tsx` — `Pagination` client component; props: `page` (1-based), `totalPages`, `onPageChange`, optional `totalItems`/`pageSize` for range label; renders "Showing X–Y of Z" or "Page X of Y"; smart page-number list (first, last, current±1, ellipsis); First/Prev/Next/Last icon buttons (`ChevronsLeft`/`ChevronLeft`/`ChevronRight`/`ChevronsRight`); returns `null` when `totalPages <= 1`; full `aria-label` + `aria-current` accessibility.

**Notes:**
- All components are `'use client'` — safe to import from any Server or Client component.
- `DataTable` imports `TableSkeleton` and `EmptyState` internally — no extra wiring needed at call sites.
- `RoleGate` uses the same `Role` union (`SUPER_ADMIN` | `TENANT_ADMIN` | `INSTRUCTOR` | `STUDENT`) as the sidebar navigation config.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 3.2: Dashboard Layout ✅

**Files created:**
- `components/ui/tooltip.tsx` — Tooltip primitive built from `radix-ui` `Tooltip` namespace; exports `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent` with arrow; matches shadcn/ui New York style.
- `components/layout/sidebar.tsx` — `Sidebar` client component; reads `user.roles` from auth store and `sidebarCollapsed` from UI store; filters `navigation` array by role; renders full-width nav links when expanded, icon-only links with `TooltipContent` side labels when collapsed; collapse/expand toggle button at bottom; `w-64` expanded / `w-16` collapsed with `transition-all duration-300`; uses `ScrollArea` for nav overflow.
- `components/layout/header.tsx` — `Header` client component; mobile hamburger (`Menu` icon) calls `toggleSidebar`; renders `<Breadcrumbs />`; theme toggle `DropdownMenu` (Light / Dark / System via `next-themes` `setTheme`); user avatar `DropdownMenu` showing display name, email, role; Profile / Settings links; Log out action calls `logout()` + `router.push('/login')`.
- `components/layout/breadcrumbs.tsx` — `Breadcrumbs` client component; splits `usePathname()` into segments; maps each segment to a human-readable label via `SEGMENT_LABELS` lookup (falls back to capitalised slug or shortened UUID); renders `Home` icon → chevron-separated links → bold current page; last segment uses `aria-current="page"`.
- `components/layout/mobile-nav.tsx` — `MobileNav` client component; `Sheet` (slide-out drawer, `side="left"`) controlled by `sidebarOpen` / `setSidebarOpen` from UI store; same role-filtered `navigation` array as sidebar; each link closes the sheet on click; `X` close button in sheet header.
- `app/(dashboard)/layout.tsx` — Dashboard route-group layout; `flex h-svh overflow-hidden` root; desktop `<Sidebar />` hidden on mobile (`hidden lg:flex`); `<MobileNav />` always mounted (Sheet handles visibility); `<Header />` + scrollable `<main>` with `container mx-auto p-6`; exports `metadata` with `title.template`.

**Notes:**
- `tooltip.tsx` was created manually (shadcn CLI pnpm install failed in workspace); uses same `radix-ui` named-export pattern as other shadcn components.
- Sidebar collapse state persists to `localStorage` via `useUIStore` (Task 2.4).
- Mobile nav open/close state is driven by `useUIStore.sidebarOpen`; the desktop hamburger in `Header` calls `toggleSidebar` which opens the `MobileNav` Sheet on mobile.
- Role filtering uses `user.roles` array — all roles visible to `SUPER_ADMIN`, `TENANT_ADMIN`, `INSTRUCTOR`, `STUDENT` as per spec.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 3.1: Auth Layout ✅

**Files created:**
- `app/(auth)/layout.tsx` — Auth route-group layout; full-viewport centered flex column (`min-h-svh`, `bg-muted/40`); constrains content to `max-w-sm`; renders Pandalang 🐼 logo icon (rounded `bg-primary` tile) + "Pandalang" wordmark above `{children}`; no sidebar, no header; exports `metadata` with `title.template` for auth pages.

**Notes:**
- Uses Next.js App Router route group `(auth)` — does not affect URL paths.
- Branding block is purely presentational (emoji + text); no extra image assets required.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 2.6: Next.js Middleware ✅

**Files created:**
- `middleware.ts` — Next.js Edge middleware at project root; defines `PUBLIC_ROUTES` (`/login`, `/register`); reads `auth-status` cookie to determine `isAuthenticated`; redirects authenticated users away from public routes to `/dashboard`; redirects unauthenticated users from all other routes to `/login` with `callbackUrl` query param; `config.matcher` excludes `api`, `_next/static`, `_next/image`, `favicon.ico`, and any path containing a file extension.

**Notes:**
- Role-based access control is enforced client-side via a `RoleGate` component (Task 3.3) — middleware only checks the lightweight `auth-status` cookie, never decodes JWTs.
- `callbackUrl` is appended to the login redirect so the user is returned to the originally requested page after authentication.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 2.5: Auth Initializer ✅

**Files created/updated:**
- `components/providers/auth-initializer.tsx` — `AuthInitializer` client component; on mount checks persisted `refreshToken` from auth store; if present, calls `authService.refresh()` to silently restore tokens via `setTokens`, then calls `authService.getMe()` to restore user via `setUser`; on any failure calls `logout()` to clear state and cookie; always calls `setInitialized(true)` in `finally`; renders a full-page centered spinner (`animate-spin` div) while `isInitialized` is `false`; renders `children` once initialized.
- `components/providers/providers.tsx` — Updated to wrap `ThemeProvider` children with `<AuthInitializer>`, placing it inside `QueryProvider` so React Query is available for any future query-based initialization.

**Notes:**
- `AuthInitializer` is a `'use client'` component; the `useEffect` dependency array is intentionally empty (runs once on mount) with `eslint-disable-line react-hooks/exhaustive-deps`.
- Loading spinner uses Tailwind `animate-spin` + `border-primary` / `border-t-transparent` pattern — no extra dependency needed.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 2.4: Zustand Stores ✅

**Files updated:**
- `stores/auth.store.ts` — `useAuthStore` with state: `accessToken`, `refreshToken`, `user`, `isInitialized`; computed `isAuthenticated` getter; actions: `login` (stores tokens + user + sets `auth-status` cookie), `setTokens`, `setUser`, `logout` (clears state + cookie), `setInitialized`; persists `refreshToken` and `user` to `sessionStorage` via `pandalang-auth` key; `accessToken` stays in memory only (not persisted).
- `stores/tenant.store.ts` — `useTenantStore` with state: `tenantId`, `tenantSlug`, `tenantName`; actions: `setTenant`, `clearTenant`; persists all fields to `sessionStorage` via `pandalang-tenant` key.
- `stores/ui.store.ts` — `useUIStore` with state: `sidebarOpen` (default `true`), `sidebarCollapsed` (default `false`); actions: `toggleSidebar`, `setSidebarOpen`, `toggleSidebarCollapsed`; persists to `localStorage` via `pandalang-ui` key.

**Notes:**
- All stores use `zustand/middleware` `persist` + `createJSONStorage`.
- `login` and `logout` in auth store guard `document.cookie` access with `typeof document !== 'undefined'` for SSR safety.
- `partialize` on auth store ensures only `refreshToken` + `user` are written to `sessionStorage`; `accessToken` is never persisted.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 2.3: API Service Functions ✅

**Files created:**
- `lib/api/services/auth.service.ts` — `authService` with `login`, `register`, `refresh`, `logout`, `getMe`; all methods fully typed against `@/types` auth types.
- `lib/api/services/tenants.service.ts` — `tenantsService` with `list`, `getById`, `create`, `update`, `updateStatus`; supports `PaginationParams & { search? }` on list.
- `lib/api/services/users.service.ts` — `usersService` with `list`, `getById`, `create`, `update`, `deactivate`, `assignRole`, `removeRole`; list supports `search`, `role`, `isActive` filters.
- `lib/api/services/courses.service.ts` — `coursesService` with `list`, `getById`, `create`, `update`, `delete`, `publish`, `archive`; list supports `search`, `status`, `level` filters.
- `lib/api/services/sections.service.ts` — `sectionsService` with `list`, `create`, `update`, `delete`; all methods take `courseId` as first param.
- `lib/api/services/lessons.service.ts` — `lessonsService` with `list`, `getById`, `create`, `update`, `delete`; all methods take `courseId` + `sectionId` as first params.
- `lib/api/services/quizzes.service.ts` — `quizzesService` with `create`, `getById`, `update`, `delete`, `addQuestion`, `updateQuestion`, `deleteQuestion`, `submitAttempt`, `listAttempts`.
- `lib/api/services/enrollments.service.ts` — `enrollmentsService` with `create`, `getMyEnrollments`, `getById`, `updateProgress`, `getCourseEnrollments`; `getCourseEnrollments` uses `ENDPOINTS.courses.enrollments(courseId)`.

**Notes:**
- All services import `apiClient` from `../client` and `ENDPOINTS` from `../endpoints`.
- All request/response types imported from `@/types` barrel export.
- Query params passed as `Record<string, string | number | boolean | undefined | null>` to match `apiClient.get()` signature.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 2.2: API Client ✅

**Files updated:**
- `lib/api/client.ts` — Full `ApiClient` class with `get`, `post`, `patch`, `put`, `delete` methods; auto-injects `Authorization: Bearer <token>` from auth store; auto-injects `x-tenant-id` header from tenant store; handles 401 with single automatic token refresh via `/api/v1/auth/refresh`; `buildUrl` helper appends query params; `handleResponse` unwraps API envelope (`data.data`) and normalises errors; `ApiError` custom error class with `status`, `code`, `details`; exports singleton `apiClient` instance.
- `lib/api/endpoints.ts` — All API endpoint constants in `ENDPOINTS` object organised by feature: `auth`, `tenants`, `users`, `courses`, `sections`, `lessons`, `quizzes`, `enrollments`, `health`. Static paths as string literals; dynamic paths as typed functions `(id: string) => string`.

**Notes:**
- Store access uses lazy `require()` inside getter functions to avoid circular dependency issues while `stores/auth.store.ts` and `stores/tenant.store.ts` are still placeholders (Task 2.4); falls back gracefully to `null` when stores are not yet initialised.
- `onTokenRefresh` calls the refresh endpoint directly with `fetch` (no `apiClient`) to prevent infinite recursion.
- `onAuthError` calls `logout()` on the auth store and redirects to `/login` (guarded by `typeof window !== 'undefined'` for SSR safety).
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0)

---

## Task 2.1: TypeScript Types ✅

**Files updated:**
- `types/api.ts` — `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiErrorResponse`, `PaginationParams`
- `types/auth.ts` — `AuthUser`, `AuthResponse`, `TokensResponse`, `LoginRequest`, `RegisterRequest`
- `types/tenant.ts` — `Tenant`, `TenantStatus`, `CreateTenantRequest`, `UpdateTenantRequest`, `UpdateTenantStatusRequest`
- `types/user.ts` — `User`, `Role`, `CreateUserRequest`, `UpdateUserRequest`, `AssignRoleRequest`
- `types/course.ts` — `Course`, `Section`, `Lesson`, `CourseLevel`, `CourseStatus`, `ContentType`, all create/update request types
- `types/enrollment.ts` — `Enrollment`, `EnrollmentStatus`, `EnrollmentCourse`, `EnrollmentUser`, `CreateEnrollmentRequest`, `UpdateProgressRequest`
- `types/quiz.ts` — `Quiz`, `QuizQuestion`, `QuizAnswer`, `QuizAttempt`, `QuestionType`, `SubmitQuizRequest`, `SubmitQuizAnswer`, create/update request types for quizzes and questions
- `types/index.ts` — Barrel re-export of all types from all domain modules

**Notes:**
- All types derived from backend API swagger schemas in `plans/04-api-client-layer.md` Sections 2–3
- `QuizAnswer.isCorrect` intentionally omitted (not exposed to students by the API)
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0)
- Types importable via `@/types` barrel export

---

## Task 1.5: Set Up Providers ✅

**Files created/updated:**
- `components/providers/query-provider.tsx` — React Query provider with `QueryClient` (staleTime 5 min, gcTime 10 min, retry logic skipping 4xx, `refetchOnWindowFocus`, `refetchOnReconnect`). Includes `ReactQueryDevtools` in development.
- `components/providers/theme-provider.tsx` — `next-themes` provider with `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`.
- `components/providers/providers.tsx` — Composed provider wrapping `QueryProvider` → `ThemeProvider`.
- `app/layout.tsx` — Updated metadata (`title` with template, `description`), added `suppressHydrationWarning` on `<html>`, wrapped `{children}` with `<Providers>`.
- `lib/api/client.ts` — Added `ApiError` stub class (with `status`, `code`, `details`) and `apiClient` singleton stub to unblock TypeScript imports ahead of Task 2.2.

**Notes:**
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0)
- `suppressHydrationWarning` on `<html>` prevents next-themes hydration mismatch
- `Providers` is a `'use client'` boundary; root layout remains a Server Component

---

## Task 1.4: Create Directory Structure ✅

**Directories and files created:**

- `lib/api/client.ts` — Placeholder for API client (Task 2.2)
- `lib/api/endpoints.ts` — Placeholder for API endpoint constants (Task 2.2)
- `lib/api/types.ts` — Placeholder for API response envelope types (Task 2.2)
- `lib/api/services/` — Placeholder directory for service functions (Task 2.3)
- `types/api.ts` — Placeholder for `ApiResponse<T>`, `PaginatedResponse<T>`, etc. (Task 2.1)
- `types/auth.ts` — Placeholder for `AuthUser`, `AuthResponse`, etc. (Task 2.1)
- `types/course.ts` — Placeholder for `Course`, `Section`, `Lesson`, etc. (Task 2.1)
- `types/enrollment.ts` — Placeholder for `Enrollment`, `EnrollmentStatus`, etc. (Task 2.1)
- `types/quiz.ts` — Placeholder for `Quiz`, `QuizQuestion`, `QuizAttempt`, etc. (Task 2.1)
- `types/user.ts` — Placeholder for `User`, `Role`, etc. (Task 2.1)
- `types/tenant.ts` — Placeholder for `Tenant`, `TenantStatus`, etc. (Task 2.1)
- `types/index.ts` — Barrel export placeholder (Task 2.1)
- `stores/auth.store.ts` — Placeholder for Zustand auth store (Task 2.4)
- `stores/tenant.store.ts` — Placeholder for Zustand tenant store (Task 2.4)
- `stores/ui.store.ts` — Placeholder for Zustand UI store (Task 2.4)
- `hooks/` — Placeholder directory for shared hooks
- `components/layout/` — Placeholder directory for layout components (Task 3.2)
- `components/shared/` — Placeholder directory for shared components (Task 3.3)
- `components/providers/` — Placeholder directory for provider components (Task 1.5)
- `features/auth/{components,hooks,schemas}/` — Auth feature subdirectories
- `features/courses/{components,hooks,schemas}/` — Courses feature subdirectories
- `features/enrollments/{components,hooks,schemas}/` — Enrollments feature subdirectories
- `features/quizzes/{components,hooks,schemas}/` — Quizzes feature subdirectories
- `features/users/{components,hooks,schemas}/` — Users feature subdirectories
- `features/tenants/{components,hooks,schemas}/` — Tenants feature subdirectories

**Notes:**
- All `.ts` files contain `export {}` placeholder with comments describing full implementation
- All empty directories use `.gitkeep` to be tracked by git
- TypeScript compiles with no errors (placeholder files use `export {}`)

---

## Task 1.3: Environment Configuration ✅

**Files created/updated:**
- `.env.local` — Local development environment variables
- `.env.example` — Template with placeholder values (committed to repo)
- `next.config.ts` — Updated with `images.remotePatterns` for CDN domains and API rewrites

**Environment variables configured:**
- `NEXT_PUBLIC_API_URL=http://localhost:3000` — Backend API base URL
- `NEXT_PUBLIC_APP_URL=http://localhost:3001` — Frontend app URL
- `NEXT_PUBLIC_DEFAULT_TENANT_SLUG=demo` — Default tenant for development

**next.config.ts additions:**
- `images.remotePatterns` for AWS S3, Cloudinary, Supabase, Gravatar CDN domains
- `rewrites()` proxying `/api/v1/*` → `NEXT_PUBLIC_API_URL/api/v1/*` for CORS-free dev

**Notes:**
- `.env.local` is covered by `.env*` pattern in `.gitignore` (not committed)
- `.env.example` is committed as a template for new developers

---

## Task 1.2: Initialize shadcn/ui ✅

**shadcn/ui initialized with:**
- Style: New York
- Base color: Neutral
- CSS variables: Yes (oklch color space)
- Tailwind CSS v4 config
- Components directory: `components/ui`
- Utils location: `lib/utils.ts`

**Core shadcn components installed:**
- `button`, `card`, `input`, `label`, `dialog`, `dropdown-menu`
- `tabs`, `table`, `badge`, `avatar`, `skeleton`, `progress`
- `select`, `textarea`, `checkbox`, `switch`, `separator`, `sheet`
- `scroll-area`, `alert-dialog`, `command`, `popover`, `radio-group`, `sonner`

**Additional dependencies installed:**
- `clsx` 2.1.1
- `tailwind-merge` 3.5.0
- `class-variance-authority` 0.7.1
- `lucide-react` 0.575.0
- `radix-ui` 1.4.3
- `tw-animate-css` 1.4.0
- `cmdk` 1.1.1

**Files created/updated:**
- `components.json` — shadcn configuration
- `components/ui/` — 24 UI component files
- `lib/utils.ts` — `cn()` utility function
- `app/globals.css` — Updated with project color palette (deep indigo primary, green accent)

---

## Task 1.1: Install Dependencies ✅

**Production dependencies installed:**
- `@tanstack/react-query` 5.90.21
- `@tanstack/react-query-devtools` 5.91.3
- `zustand` 5.0.11
- `react-hook-form` 7.71.2
- `zod` 4.3.6
- `@hookform/resolvers` 5.2.2
- `date-fns` 4.1.0
- `nuqs` 2.8.8
- `sonner` 2.0.7
- `next-themes` 0.4.6
- `@dnd-kit/core` 6.3.1
- `@dnd-kit/sortable` 10.0.0
- `@dnd-kit/utilities` 3.2.2

**Dev dependencies installed:**
- `prettier` 3.8.1
- `prettier-plugin-tailwindcss` 0.7.2