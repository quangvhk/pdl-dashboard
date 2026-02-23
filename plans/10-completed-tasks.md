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

