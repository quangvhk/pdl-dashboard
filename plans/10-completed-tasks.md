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

