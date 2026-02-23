# Pandalang — Completed Tasks

## FE-1.1: Update TypeScript Types for V2 API

**Completed:** 2026-02-23

### Summary
Rewrote all TypeScript type definitions to match the V2 multi-tenant backend API.

### Files Modified
- `types/auth.ts` — Removed `tenantId`/`roles` from `AuthUser`; added `isSuperAdmin`, `UserTenant`, `SwitchTenantRequest`, `SwitchTenantResponse`; removed `tenantSlug` from `LoginRequest`/`RegisterRequest`; updated `AuthResponse` to include `tenants?: UserTenant[]`
- `types/user.ts` — Removed `tenantId`, `roles`, `CreateUserRequest`, `AssignRoleRequest`; added `isSuperAdmin`, `tenants: UserTenantSummary[]`
- `types/tenant.ts` — Added `ownerId: string` to `Tenant`
- `types/enrollment.ts` — Added `grantedBy: string | null`; added `GrantEnrollmentRequest`; updated `UpdateProgressRequest` (`completed` → `isCompleted`, added `timeSpentSeconds`)
- `types/index.ts` — Added barrel exports for all new type files

### Files Created
- `types/member.ts` — `Member`, `MemberUser`, `MemberStatus`, `ChangeRoleRequest`, `ListMembersParams`
- `types/invitation.ts` — `Invitation`, `InvitationTenant`, `InvitationStatus`, `CreateInvitationRequest`, `AcceptInvitationRequest`
- `types/role.ts` — `PlatformRole`, `CreateRoleRequest`, `UpdateRoleRequest`
- `types/permission.ts` — `Permission`, `CreatePermissionRequest`, `RolePermission`, `AssignPermissionRequest`

### Downstream Fixes (required for TypeScript to compile)
- `stores/auth.store.ts` — Rewrote to V2 shape: `tenants[]`, `currentTenantId`, `currentRole`, `currentRoleId`, `isSuperAdmin` computed; `login(AuthResponse)`, `switchTenant(SwitchTenantResponse)`, `setTenants()`; persisted to sessionStorage
- `lib/api/services/users.service.ts` — Removed `create()`, `assignRole()`, `removeRole()`
- `components/shared/role-gate.tsx` — Updated to use `currentRole`/`isSuperAdmin` from auth store
- `features/auth/hooks/use-login.ts` — Removed `tenantSlug`; passes full `AuthResponse` to `login()`
- `features/auth/hooks/use-register.ts` — Removed `tenantSlug`; passes full `AuthResponse` to `login()`
- `features/auth/schemas/login.schema.ts` — Removed `tenantSlug` field
- `features/auth/schemas/register.schema.ts` — Removed `tenantSlug` field
- `features/auth/components/login-form.tsx` — Removed tenant slug field
- `features/auth/components/register-form.tsx` — Removed tenant slug field
- `features/auth/components/user-menu.tsx` — Uses `currentRole` from auth store
- `features/users/hooks/use-assign-role.ts` — Stubbed out (replaced by Members module)
- `features/users/hooks/use-create-user.ts` — Stubbed out (replaced by Invitations module)
- `features/users/schemas/user.schema.ts` — Removed `createUserSchema`
- `features/users/components/user-form.tsx` — Stubbed out (no more user creation form)
- `features/users/components/user-detail.tsx` — Replaced `roles[]` with `tenants[]` display
- `features/users/components/user-table.tsx` — Replaced Roles column with Tenants count; removed role filter
- `features/courses/components/course-detail.tsx` — Uses `currentRole`/`isSuperAdmin`
- `features/courses/components/lesson-viewer.tsx` — `completed` → `isCompleted`
- `app/(dashboard)/dashboard/page.tsx` — Uses `isSuperAdmin`/`currentRole`
- `app/(dashboard)/settings/page.tsx` — Uses `isSuperAdmin`/`currentRole`/`currentTenant`
- `app/(dashboard)/users/page.tsx` — Uses `isSuperAdmin`/`currentRole`
- `app/(dashboard)/users/new/page.tsx` — Uses `isSuperAdmin`/`currentRole`
- `app/(dashboard)/users/[userId]/page.tsx` — Uses `isSuperAdmin`/`currentRole`
- `app/(dashboard)/tenants/page.tsx` — Uses `isSuperAdmin`
- `app/(dashboard)/tenants/new/page.tsx` — Uses `isSuperAdmin`
- `app/(dashboard)/tenants/[tenantId]/page.tsx` — Uses `isSuperAdmin`
- `app/(dashboard)/courses/page.tsx` — Uses `isSuperAdmin`/`currentRole`
- `app/(dashboard)/courses/new/page.tsx` — Uses `isSuperAdmin`/`currentRole`
- `app/(dashboard)/courses/[courseId]/edit/page.tsx` — Uses `isSuperAdmin`/`currentRole`
- `app/(dashboard)/courses/[courseId]/enrollments/page.tsx` — Uses `isSuperAdmin`/`currentRole`
- `components/layout/sidebar.tsx` — Uses `isSuperAdmin`/`currentRole`
- `components/layout/mobile-nav.tsx` — Uses `isSuperAdmin`/`currentRole`
- `components/layout/header.tsx` — Uses `currentRole`

---

## FE-1.2: Update Auth Store for V2

**Completed:** 2026-02-23

### Summary
Rewrote auth store to use proper Zustand selector pattern — removed JavaScript getter properties (incompatible with `persist` middleware) and replaced with exported selector functions and inline selectors. Added `selectIsSuperAdmin`, `selectIsAuthenticated`, `selectHasMultipleTenants`, `selectCurrentTenant` selectors plus `useIsSuperAdmin()` and `useCurrentTenant()` convenience hooks.

### Files Modified
- `stores/auth.store.ts` — Removed computed getter properties (`isAuthenticated`, `isSuperAdmin`, `hasMultipleTenants`) from `AuthState` interface; added exported selector functions (`selectIsAuthenticated`, `selectIsSuperAdmin`, `selectHasMultipleTenants`, `selectCurrentTenant`) and convenience hooks (`useIsSuperAdmin`, `useCurrentTenant`)

### Downstream Fixes (required for TypeScript to compile)
- `components/shared/role-gate.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `components/layout/mobile-nav.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `components/layout/sidebar.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `features/auth/hooks/use-current-user.ts` — `s.isAuthenticated` → `!!s.user`
- `features/courses/components/course-detail.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `features/enrollments/hooks/use-enrollments.ts` — `s.isAuthenticated` → `!!s.user`
- `app/(dashboard)/users/page.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `app/(dashboard)/users/new/page.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `app/(dashboard)/users/[userId]/page.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `app/(dashboard)/tenants/page.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `app/(dashboard)/tenants/new/page.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `app/(dashboard)/tenants/[tenantId]/page.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `app/(dashboard)/settings/page.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `app/(dashboard)/dashboard/page.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `app/(dashboard)/courses/page.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `app/(dashboard)/courses/new/page.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `app/(dashboard)/courses/[courseId]/edit/page.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`
- `app/(dashboard)/courses/[courseId]/enrollments/page.tsx` — `s.isSuperAdmin` → `s.user?.isSuperAdmin ?? false`

---

## FE-1.3: Update Tenant Store for V2

**Completed:** 2026-02-23

### Summary
Simplified tenant store to be a thin sync layer for the current tenant context. Added `setFromAuthStore()` action that accepts `tenantId`, `tenantSlug`, `tenantName` to be called after `switchTenant()` resolves in the auth store. Kept `setTenant()` for backward compatibility with the API client's `getTenantId()` getter. Kept `clearTenant()` for logout flow.

### Files Modified
- `stores/tenant.store.ts` — Added `setFromAuthStore(tenantId, tenantSlug, tenantName)` action; kept `setTenant()` and `clearTenant()`; removed no-op computed properties; store remains persisted to sessionStorage

---

## FE-1.4: Update API Endpoints for V2

**Completed:** 2026-02-23

### Summary
Updated `lib/api/endpoints.ts` to match the V2 multi-tenant backend API. Added new endpoint groups for `members`, `invitations`, `roles`, `permissions`, and `rolePermissions`. Added `switchTenant` to `auth` and `transferOwnership` to `tenants`. Removed deprecated `users.create`, `users.assignRole`, and `users.removeRole` endpoints (replaced by Members + Invitations modules).

### Files Modified
- `lib/api/endpoints.ts` — Added `auth.switchTenant`; added `tenants.transferOwnership`; removed `users.create`, `users.assignRole`, `users.removeRole`; added full `members`, `invitations`, `roles`, `permissions`, `rolePermissions` endpoint groups

---

## FE-1.5: Update API Service Functions for V2

**Completed:** 2026-02-23

### Summary
Updated existing service files and created four new service files to match the V2 multi-tenant backend API. Auth service now supports `switchTenant()`. Tenants service adds `transferOwnership()`. Enrollments service adds `grantEnrollment()` for admin-granted access and uses V2 field names (`isCompleted`, `timeSpentSeconds`) in `updateProgress()`. Four new services cover Members, Invitations, Roles, and Permissions (including role-permission assignments).

### Files Modified
- `lib/api/services/auth.service.ts` — Added `switchTenant(SwitchTenantRequest): Promise<SwitchTenantResponse>`; updated JSDoc to reflect cookie-based auth; imported `SwitchTenantRequest`, `SwitchTenantResponse`
- `lib/api/services/tenants.service.ts` — Added `transferOwnership(id, { newOwnerId }): Promise<Tenant>`
- `lib/api/services/enrollments.service.ts` — Added `grantEnrollment(GrantEnrollmentRequest)` for admin-granted enrollment; updated `updateProgress()` JSDoc to note V2 field names (`isCompleted`, `timeSpentSeconds`); imported `GrantEnrollmentRequest`

### Files Created
- `lib/api/services/members.service.ts` — `list(ListMembersParams)`, `getById()`, `changeRole()`, `suspend()`, `activate()`, `remove()`
- `lib/api/services/invitations.service.ts` — `list()`, `create(CreateInvitationRequest)`, `cancel()`, `accept(AcceptInvitationRequest)`
- `lib/api/services/roles.service.ts` — `list()`, `getById()`, `create(CreateRoleRequest)`, `update(UpdateRoleRequest)`, `remove()`
- `lib/api/services/permissions.service.ts` — `list()`, `getById()`, `create(CreatePermissionRequest)`, `remove()`; plus role-permission methods: `listRolePermissions()`, `assignPermission(AssignPermissionRequest)`, `removeRolePermission()`

---

## FE-1.6: Update Auth Initializer for V2

**Completed:** 2026-02-23

### Summary
Rewrote the auth initializer to support cookie-based session restoration for the V2 multi-tenant auth model. The new flow: (1) calls `authService.refresh()` with no body — the httpOnly cookie is sent automatically; (2) if refresh succeeds, calls `authService.getMe()` to refresh the user object; (3) if `currentTenantId` is persisted in sessionStorage and still present in the tenants list, re-issues the tenant-scoped JWT via `authService.switchTenant()` and syncs the tenant store; (4) if the persisted tenant is no longer valid or refresh fails, clears all auth state. Initialization is guarded by `isInitialized` to run only once on mount.

### Files Modified
- `components/providers/auth-initializer.tsx` — Replaced `getMe()`-only flow with full V2 restore sequence: `refresh()` → `getMe()` → optional `switchTenant()` → sync tenant store; removed unused `login`/`setTenants`/`selectCurrentTenant` imports; dependency array changed from `[pathname]` to `[isInitialized]`

---

## FE-2.1: Update Auth Schemas

**Completed:** 2026-02-23

### Summary
Verified that both auth schemas already have no `tenantSlug` field — they were cleaned up as part of FE-1.1 downstream fixes. No additional changes required.

### Files Verified (no changes needed)
- `features/auth/schemas/login.schema.ts` — Contains only `email` and `password` fields; no `tenantSlug`
- `features/auth/schemas/register.schema.ts` — Contains `email`, `password`, `firstName`, `lastName`; no `tenantSlug`

---

## FE-2.2: Update Auth Hooks for V2

**Completed:** 2026-02-23

### Summary
Updated `use-login.ts` to auto-switch tenant when the user belongs to exactly one tenant (calls `authService.switchTenant()` and syncs the tenant store immediately after login). Created the new `use-switch-tenant.ts` mutation hook for explicit tenant switching from the UI. Verified `use-register.ts`, `use-logout.ts`, and `use-current-user.ts` were already correct for V2.

### Files Modified
- `features/auth/hooks/use-login.ts` — Added auto-switch logic: if `tenants.length === 1`, calls `authService.switchTenant()` → `authStore.switchTenant()` → `tenantStore.setFromAuthStore()` before redirecting to dashboard; imported `useTenantStore`

### Files Created
- `features/auth/hooks/use-switch-tenant.ts` — `useSwitchTenant` mutation hook: calls `authService.switchTenant({ tenantId })`, updates auth store via `switchTenant()`, syncs tenant store via `setFromAuthStore()`, invalidates all React Query cache (tenant-scoped data), shows success/error toasts

---

## FE-2.3: Update Login and Register Forms

**Completed:** 2026-02-23

### Summary
Verified that both auth forms already have no `tenantSlug` field and no `NEXT_PUBLIC_DEFAULT_TENANT_SLUG` pre-fill — they were cleaned up as part of FE-1.1 downstream fixes. Post-login routing logic (auto-switch for single tenant, redirect to dashboard for multiple/no tenants) is handled in `use-login.ts` and `use-register.ts` hooks (completed in FE-2.2). No additional form changes required.

### Files Verified (no changes needed)
- `features/auth/components/login-form.tsx` — Contains only `email` and `password` fields; no `tenantSlug`; no `NEXT_PUBLIC_DEFAULT_TENANT_SLUG` reference
- `features/auth/components/register-form.tsx` — Contains `firstName`, `lastName`, `email`, `password` fields; no `tenantSlug`

---

## FE-2.4: Create Tenant Switcher Component

**Completed:** 2026-02-23

### Summary
Built the tenant switcher UI for users with multiple tenant memberships. The `TenantSwitcher` dropdown shows all tenant memberships with name, slug, role badge, and status. The current tenant is highlighted with a checkmark. Suspended tenants are shown but not clickable. Super Admin sees a global access indicator. Added `TenantSwitcher` to the header bar (shown when user has tenants). Updated sidebar to show current tenant name/slug/role context below the logo, a "No tenant selected" warning for users without active tenant context, and new navigation items for Members, Invitations, Roles, Permissions, and Role Permissions with correct role-based visibility.

### Files Created
- `features/auth/components/tenant-switcher.tsx` — Dropdown showing all user tenants; current tenant highlighted with checkmark; SUSPENDED tenants shown but disabled; Super Admin global access indicator; calls `useSwitchTenant` on selection; shows loading state during switch

### Files Modified
- `components/layout/header.tsx` — Added `TenantSwitcher` component between breadcrumbs and theme toggle; separated by a vertical divider
- `components/layout/sidebar.tsx` — Added current tenant context section below logo (shows tenant name, slug, role badge; or "Super Admin / Global access"; or "No tenant selected" warning); added new nav items: Members (`/members`, TENANT_ADMIN + SUPER_ADMIN), Invitations (`/invitations`, TENANT_ADMIN + INSTRUCTOR + SUPER_ADMIN), Roles (`/roles`, SUPER_ADMIN only), Permissions (`/permissions`, SUPER_ADMIN only), Role Permissions (`/role-permissions`, TENANT_ADMIN + SUPER_ADMIN); added `superAdminOnly` flag to NavItem interface; added `formatRole()` helper; added no-tenant-context warning banner in nav area

---

## FE-2.5: Update User Menu Component

**Completed:** 2026-02-23

### Summary
Updated the user menu dropdown to reflect the V2 auth model. Removed role display from `user.roles` array (already cleaned up in FE-1.1). Added `isSuperAdmin` badge (red "Super Admin" badge with shield icon) shown next to the display name. Added current tenant name + role display using `selectCurrentTenant` and `selectIsSuperAdmin` selectors from the auth store. Super Admin without a tenant context shows "Global access" indicator. Role string is title-cased for display (e.g. `TENANT_ADMIN` → `Tenant Admin`). Kept profile/settings/logout actions unchanged.

### Files Modified
- `features/auth/components/user-menu.tsx` — Added `isSuperAdmin` badge next to display name; added current tenant name + role row using `Building2` icon; added "Global access" fallback for Super Admin without tenant; imported `Badge`, `ShieldCheck`, `Building2`; imported `selectCurrentTenant`, `selectIsSuperAdmin` from auth store; widened dropdown to `w-64`; role string formatted to title case

