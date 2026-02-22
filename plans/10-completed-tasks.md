# Pandalang — Completed Tasks

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