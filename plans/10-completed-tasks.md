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

---

## FE-3.1: Update RoleGate Component

**Completed:** 2026-02-23

### Summary
Verified that `RoleGate` was already fully updated for V2 as part of FE-1.1/FE-1.2 downstream fixes. The component reads `currentRole` (single role per tenant) and `isSuperAdmin` from the auth store. Super Admin always bypasses all role gates. When `currentRole === null` (no tenant selected), access is denied for tenant-scoped pages.

### Files Verified (no changes needed)
- `components/shared/role-gate.tsx` — Reads `currentRole` and `user?.isSuperAdmin ?? false` from auth store; Super Admin bypasses all gates; `currentRole === null` denies access; `allowedRoles.includes(currentRole)` for single role match

---

## FE-3.2: Update Sidebar Navigation for V2 Roles

**Completed:** 2026-02-23

### Summary
Verified that the sidebar was already fully updated for V2 as part of FE-2.4 downstream fixes. The sidebar uses `currentRole` and `isSuperAdmin` for role-based nav filtering, shows current tenant context below the logo, includes all new nav items (Members, Invitations, Roles, Permissions, Role Permissions), and shows a no-tenant warning banner.

### Files Verified (no changes needed)
- `components/layout/sidebar.tsx` — Uses `currentRole`/`isSuperAdmin` for nav filtering; `superAdminOnly` flag on nav items; tenant context section below logo; no-tenant warning banner; all new nav items present

---

## FE-3.3: Update Dashboard Page for V2 Roles

**Completed:** 2026-02-23

### Summary
Verified that the dashboard page was already fully updated for V2 as part of FE-1.1/FE-1.2 downstream fixes. The page uses `isSuperAdmin` and `currentRole` checks (single role string comparisons) to render the correct dashboard variant for each role.

### Files Verified (no changes needed)
- `app/(dashboard)/dashboard/page.tsx` — Uses `s.user?.isSuperAdmin ?? false` and `currentRole === 'TENANT_ADMIN'` / `currentRole === 'INSTRUCTOR'` checks; renders `SuperAdminDashboard`, `TenantAdminDashboard`, `InstructorDashboard`, or `StudentDashboard` accordingly

---

## FE-3.4: Update Middleware for V2

**Completed:** 2026-02-23

### Summary
Updated Next.js middleware to use the V2 httpOnly cookie-based auth model. Replaced `accessToken`/`refreshToken` cookie checks with a single `auth-status` cookie check (a non-httpOnly indicator cookie set by the backend). Added `/invitations/accept` to public routes so invitation acceptance works without authentication.

### Files Modified
- `middleware.ts` — Replaced `hasAccessToken || hasRefreshToken` check with `hasAuthStatus` (`auth-status` cookie); added `/invitations/accept` to `PUBLIC_ROUTES`; updated comments to explain V2 cookie strategy

---

## FE-4.1: Create Members Feature Module

**Completed:** 2026-02-23

### Summary
Built the full tenant member management UI. Includes query/mutation hooks with React Query, a Zod schema for the change-role form, a paginated member table with search + status filter + per-row actions dropdown, a member detail view with role/status management, a change-role dialog that fetches available roles from `GET /roles`, and the members list + detail pages with loading skeletons. All pages are role-gated to `TENANT_ADMIN` + `SUPER_ADMIN` and require an active tenant context.

### Files Created
- `features/members/hooks/use-members.ts` — `membersQueryKeys` factory + `useMembers` query hook with `ListMembersParams` (search, status, pagination)
- `features/members/hooks/use-member.ts` — Single member query using `membersQueryKeys.detail`
- `features/members/hooks/use-change-role.ts` — `useChangeRole` mutation; updates detail cache + invalidates list; shows "Role updated" toast
- `features/members/hooks/use-suspend-member.ts` — `useSuspendMember` + `useActivateMember` mutations; updates detail cache + invalidates list; shows "Member suspended" / "Member activated" toasts
- `features/members/hooks/use-remove-member.ts` — `useRemoveMember` mutation; removes detail cache entry + invalidates list; shows "Member removed" toast
- `features/members/schemas/member.schema.ts` — `changeRoleSchema` (Zod) + `ChangeRoleFormValues` type
- `features/members/components/member-table.tsx` — Paginated table with search, status filter (All/Active/Suspended), columns: Member (avatar + name + email), Role badge, Status badge, Joined date, Actions dropdown (Change Role, Suspend/Activate, Remove with confirmation dialog); row click navigates to detail page
- `features/members/components/member-detail.tsx` — Detail view: profile card (avatar, name, email, role badge, status badge, joined date), actions card (Change Role, Suspend/Activate buttons), danger zone (Remove with confirmation dialog + redirect to `/members` on success)
- `features/members/components/change-role-dialog.tsx` — Dialog with role `<Select>` populated from `GET /roles`; pre-selects current role; Save disabled when role unchanged; calls `useChangeRole` mutation
- `app/(dashboard)/members/page.tsx` — Members list page; role-gated to `TENANT_ADMIN` + `SUPER_ADMIN`; shows "Select a tenant" message when no `currentTenantId`; "Invite Member" button links to `/invitations/new`
- `app/(dashboard)/members/[memberId]/page.tsx` — Member detail page; role-gated to `TENANT_ADMIN` + `SUPER_ADMIN`; back button to `/members`
- `app/(dashboard)/members/loading.tsx` — Loading skeleton: header, search + filter toolbar, table skeleton
- `app/(dashboard)/members/[memberId]/loading.tsx` — Loading skeleton: header, profile card, actions card

---

## FE-4.2: Create Invitations Feature Module

**Completed:** 2026-02-23

### Summary
Built the full invitation management UI. Includes query/mutation hooks with React Query, a Zod schema for the create invitation form, a paginated invitation table with email search + cancel action, a create invitation form that fetches available roles (Instructors restricted to STUDENT role only), a public accept-invitation page that auto-accepts via URL token, and the invitations list + new invitation pages with loading skeleton. The public acceptance page lives in the `(auth)` layout group so it renders without the dashboard shell. All dashboard pages are role-gated and require an active tenant context.

### Files Created
- `features/invitations/hooks/use-invitations.ts` — `invitationsQueryKeys` factory + `useInvitations` query hook
- `features/invitations/hooks/use-create-invitation.ts` — `useCreateInvitation` mutation; invalidates list; shows "Invitation sent to [email]" toast
- `features/invitations/hooks/use-cancel-invitation.ts` — `useCancelInvitation` mutation; invalidates list; shows "Invitation cancelled" toast
- `features/invitations/hooks/use-accept-invitation.ts` — `useAcceptInvitation` mutation; invalidates list; shows "Invitation accepted!" toast
- `features/invitations/schemas/invitation.schema.ts` — `createInvitationSchema` (email + roleId) + `acceptInvitationSchema` (token) with Zod; exports `CreateInvitationFormValues` and `AcceptInvitationFormValues`
- `features/invitations/components/invitation-table.tsx` — Table with controlled email search, columns: Email, Role badge, Status badge, Invited By, Expires (with overdue highlight), Actions (Cancel button with confirmation dialog for PENDING only)
- `features/invitations/components/create-invitation-form.tsx` — Card form with email input + role select (fetches from `GET /roles`); Instructors restricted to STUDENT role; Cancel navigates back; redirects to `/invitations` on success
- `features/invitations/components/accept-invitation-page.tsx` — Public component that auto-accepts invitation from `?token=` URL param; shows loading/success/error states with appropriate CTAs
- `app/(dashboard)/invitations/page.tsx` — Invitations list page; role-gated to `TENANT_ADMIN` + `SUPER_ADMIN`; shows "Select a tenant" message when no `currentTenantId`; "Invite Member" button shown to TENANT_ADMIN + INSTRUCTOR + SUPER_ADMIN
- `app/(dashboard)/invitations/new/page.tsx` — Create invitation page; role-gated to `TENANT_ADMIN` + `INSTRUCTOR` + `SUPER_ADMIN`; back button to `/invitations`
- `app/(auth)/invitations/accept/page.tsx` — Public invitation acceptance page in auth layout group; wraps `AcceptInvitationPage` in `<Suspense>` for `useSearchParams`
- `app/(dashboard)/invitations/loading.tsx` — Loading skeleton: header, search toolbar, table skeleton

---

## FE-4.3: Create Roles Feature Module (Super Admin)

**Completed:** 2026-02-23

### Summary
Built the full platform-wide role management UI for Super Admins. Includes query/mutation hooks with React Query, Zod schemas for create/update forms, a searchable role table with system-role protection, a shared create/edit role form, and the roles list + detail/edit + new role pages with loading skeleton. All pages are role-gated to `SUPER_ADMIN`. System roles are shown as read-only with a lock indicator; only custom roles can be edited or deleted.

### Files Created
- `features/roles/hooks/use-roles.ts` — `rolesQueryKeys` factory + `useRoles` query hook (5-minute stale time)
- `features/roles/hooks/use-role.ts` — Single role query using `rolesQueryKeys.detail`
- `features/roles/hooks/use-create-role.ts` — `useCreateRole` mutation; invalidates list; shows "Role created" toast
- `features/roles/hooks/use-update-role.ts` — `useUpdateRole` mutation; updates detail cache + invalidates list; shows "Role updated" toast
- `features/roles/hooks/use-delete-role.ts` — `useDeleteRole` mutation; removes detail cache entry + invalidates list; shows "Role deleted" toast
- `features/roles/schemas/role.schema.ts` — `createRoleSchema` + `updateRoleSchema` (Zod); name must be uppercase/digits/underscores; exports `CreateRoleFormValues` and `UpdateRoleFormValues`
- `features/roles/components/role-table.tsx` — Searchable table (client-side filter); columns: Name (with System badge), Description, Created; system roles show lock indicator instead of actions dropdown; custom roles have Edit + Delete (with confirmation dialog) actions; row click navigates to edit page (custom roles only)
- `features/roles/components/role-form.tsx` — Shared create/edit form card; edit mode pre-fills name + description; system roles blocked with amber warning banner; redirects to `/roles` on success; Cancel navigates back
- `app/(dashboard)/roles/page.tsx` — Roles list page; role-gated to `SUPER_ADMIN`; "New Role" button links to `/roles/new`
- `app/(dashboard)/roles/new/page.tsx` — Create role page; role-gated to `SUPER_ADMIN`; back button to `/roles`
- `app/(dashboard)/roles/[roleId]/page.tsx` — Role detail/edit page; role-gated to `SUPER_ADMIN`; fetches role and renders `RoleForm` in edit mode; shows amber warning for system roles
- `app/(dashboard)/roles/loading.tsx` — Loading skeleton: header, search toolbar, table skeleton

---

## FE-4.4: Create Permissions Feature Module (Super Admin + Tenant Admin)

**Completed:** 2026-02-23

### Summary
Built the full permission catalog and per-tenant role-permission assignment UI. Includes query/mutation hooks with React Query, Zod schemas for create permission and assign permission forms, a searchable permission catalog table with delete action, a create permission form with action/subject/inverted/conditions/reason fields, a role-permission assignments table with inline remove and an assign-permission dialog that fetches available roles and permissions, and the permissions catalog + new permission + role-permissions pages with loading skeletons. Permission catalog pages are role-gated to `SUPER_ADMIN`. Role-permissions page is role-gated to `TENANT_ADMIN` + `SUPER_ADMIN` and requires an active tenant context.

### Files Created
- `features/permissions/hooks/use-permissions.ts` — `permissionsQueryKeys` factory + `usePermissions` query hook (5-minute stale time)
- `features/permissions/hooks/use-create-permission.ts` — `useCreatePermission` mutation; invalidates list; shows "Permission created" toast
- `features/permissions/hooks/use-delete-permission.ts` — `useDeletePermission` mutation; removes detail cache entry + invalidates list; shows "Permission deleted" toast
- `features/permissions/hooks/use-role-permissions.ts` — `rolePermissionsQueryKeys` factory + `useRolePermissions` query hook with optional `roleId` filter (2-minute stale time)
- `features/permissions/hooks/use-assign-permission.ts` — `useAssignPermission` mutation; invalidates all role-permission lists; shows "Permission assigned" toast
- `features/permissions/hooks/use-remove-role-permission.ts` — `useRemoveRolePermission` mutation; invalidates all role-permission lists; shows "Permission removed" toast
- `features/permissions/schemas/permission.schema.ts` — `createPermissionSchema` (action + subject + conditions JSON string + inverted + reason) + `assignPermissionSchema` (roleId + permissionId) with Zod; exports `CreatePermissionFormValues` and `AssignPermissionFormValues`
- `features/permissions/components/permission-table.tsx` — Searchable table (client-side filter); columns: Action (mono), Subject (mono), Type (Allow/Deny badge), Conditions (JSON code), Reason, Actions (Delete with confirmation dialog)
- `features/permissions/components/permission-form.tsx` — Create permission form card; fields: action, subject, inverted toggle (deny rule), conditions (JSON textarea with validation), reason; redirects to `/permissions` on success
- `features/permissions/components/role-permission-table.tsx` — Table of role-permission assignments; columns: Role (badge), Action (mono), Subject (mono), Remove button; includes "Assign Permission" toolbar button that opens `AssignPermissionDialog`; accepts optional `roleId` prop for role-scoped views
- `features/permissions/components/assign-permission-dialog.tsx` — Dialog with role `<Select>` (populated from `GET /roles`) + permission `<Select>` (populated from `GET /permissions`, shows `action:subject` + reason); pre-selects role when `defaultRoleId` prop provided; role select disabled when pre-selected; calls `useAssignPermission` mutation
- `app/(dashboard)/permissions/page.tsx` — Permission catalog page; role-gated to `SUPER_ADMIN`; "New Permission" button links to `/permissions/new`
- `app/(dashboard)/permissions/new/page.tsx` — Create permission page; role-gated to `SUPER_ADMIN`; back button to `/permissions`
- `app/(dashboard)/role-permissions/page.tsx` — Role-permission assignments page; role-gated to `TENANT_ADMIN` + `SUPER_ADMIN`; shows "No tenant selected" message when no `currentTenantId`
- `app/(dashboard)/permissions/loading.tsx` — Loading skeleton: header, search toolbar, table skeleton (6 columns)
- `app/(dashboard)/role-permissions/loading.tsx` — Loading skeleton: header, search + action toolbar, table skeleton (4 columns)

---

## FE-5.1: Update Users Feature for V2

**Completed:** 2026-02-23

### Summary
Simplified user management for V2: removed tenant-scoped user creation and role assignment (replaced by Members + Invitations modules). Deleted stub files and the create-user page. Updated `use-users.ts` to remove the `role` filter param (users are global now). Gated the users list and detail pages to `SUPER_ADMIN` only. Updated descriptions to reflect the global user list model. Verified `user-table.tsx`, `user-detail.tsx`, and `role-badge.tsx` were already correct for V2 (updated in FE-1.1/FE-1.2 downstream fixes).

### Files Deleted
- `features/users/hooks/use-create-user.ts` — User creation replaced by registration + invitation flow
- `features/users/hooks/use-assign-role.ts` — Role assignment replaced by Members module
- `features/users/components/user-form.tsx` — No more user creation form
- `app/(dashboard)/users/new/page.tsx` — No more create user page

### Files Modified
- `features/users/hooks/use-users.ts` — Removed `role` filter param from `UseUsersParams` and `usersQueryKeys.list`; users are global, no per-tenant role filter
- `app/(dashboard)/users/page.tsx` — Gated to `SUPER_ADMIN` only (removed `TENANT_ADMIN` access); removed "New User" button; updated description to "global user accounts and tenant memberships"
- `app/(dashboard)/users/[userId]/page.tsx` — Gated to `SUPER_ADMIN` only; updated description to "profile and tenant memberships"

### Files Verified (no changes needed)
- `features/users/components/user-table.tsx` — Already V2: shows `isSuperAdmin` badge + tenants count; no role filter; updated in FE-1.1
- `features/users/components/user-detail.tsx` — Already V2: shows `tenants[]` list with role per tenant; no role management card; updated in FE-1.1
- `features/users/components/role-badge.tsx` — Already works with single role string; no changes needed
- `features/users/schemas/user.schema.ts` — Already V2: only `updateUserSchema`; `createUserSchema` removed in FE-1.1

---

## FE-5.3: Update Enrollments Feature for V2

**Completed:** 2026-02-23

### Summary
Updated the enrollments feature to support the dual enrollment model (self-enroll + admin-granted). Added `useGrantEnrollment` mutation hook for admin/instructor-initiated enrollment. Created `GrantEnrollmentDialog` component that fetches active tenant members and lets admins/instructors grant course access to a specific user. Updated `EnrollmentCard` to display enrollment source ("Self-enrolled" or "Granted by admin") using the `grantedBy` field. Updated the course enrollments page to show a "Grant Access" button for admins and instructors, and added a "Source" column to the enrollments table.

### Files Modified
- `features/enrollments/hooks/use-enroll.ts` — Added `useGrantEnrollment(courseId)` mutation hook; calls `enrollmentsService.grantEnrollment()`; invalidates `byCourse` cache; shows "Access granted!" toast
- `features/enrollments/components/enrollment-card.tsx` — Added `grantedBy` display row with `UserCheck` icon; shows "Granted by admin" when `grantedBy` is set, "Self-enrolled" otherwise
- `app/(dashboard)/courses/[courseId]/enrollments/page.tsx` — Added `GrantEnrollmentDialog` import; added `canGrantAccess` flag (TENANT_ADMIN + INSTRUCTOR + SUPER_ADMIN); added "Grant Access" button in page header actions; added "Source" column to enrollments table showing "Admin granted" or "Self-enrolled"

### Files Created
- `features/enrollments/components/grant-enrollment-dialog.tsx` — Dialog for admin/instructor to grant course access; fetches active members via `GET /members?status=ACTIVE` (lazy-loaded on dialog open); member select shows name + email; calls `useGrantEnrollment` mutation on confirm; resets state on close

---

## FE-5.2: Update Tenants Feature for V2

**Completed:** 2026-02-23

### Summary
Added `ownerId` display and transfer ownership functionality to the tenants feature. The tenant table now shows an Owner column (displays the owner's user ID). The tenant detail view shows the owner ID in the meta grid and includes a Transfer Ownership card visible to Super Admins and the current owner. The transfer dialog accepts a new owner user ID and calls `POST /tenants/:id/transfer-ownership` via the new `useTransferOwnership` mutation hook.

### Files Created
- `features/tenants/hooks/use-transfer-ownership.ts` — `useTransferOwnership` mutation hook; calls `tenantsService.transferOwnership()`; updates detail cache + invalidates list; shows "Ownership transferred" toast

### Files Modified
- `features/tenants/components/tenant-table.tsx` — Added Owner column (shows `ownerId` with `UserCircle2` icon); moved Created column to `hidden xl:table-cell` to accommodate new column
- `features/tenants/components/tenant-detail.tsx` — Added `ownerId` to meta grid (4-column layout); added Transfer Ownership card (amber-bordered, visible to Super Admin or current owner); Transfer Ownership dialog with new owner user ID input + confirmation warning; imported `useTransferOwnership`, `selectIsSuperAdmin`, `Dialog`/`DialogContent`/`DialogDescription`/`DialogFooter`/`DialogHeader`/`DialogTitle`/`DialogTrigger`, `UserCircle2`, `ArrowRightLeft`

---

## FE-5.4: Update Courses Feature for V2 Role Checks

**Completed:** 2026-02-23

### Summary
Verified that all course feature files were already fully updated for V2 role checks as part of FE-1.1/FE-1.2 downstream fixes. All files use `currentRole` (single role string) and `isSuperAdmin` from the auth store instead of the old `user.roles[]` array pattern.

### Files Verified (no changes needed)
- `features/courses/components/course-detail.tsx` — Uses `s.user?.isSuperAdmin ?? false` and `s.currentRole`; `canEdit = isInstructor || isAdmin`
- `features/courses/components/course-list.tsx` — Pure presentational component; no role checks needed
- `app/(dashboard)/courses/page.tsx` — Uses `isSuperAdmin` and `currentRole`; derives `isInstructor`, `isAdmin`, `isStudent`, `canCreate`, `showStatus`
- `app/(dashboard)/courses/[courseId]/edit/page.tsx` — Uses `isSuperAdmin` and `currentRole`; `canEdit` gate with access-denied UI
- `app/(dashboard)/courses/new/page.tsx` — Uses `isSuperAdmin` and `currentRole`; `canCreate` gate with access-denied UI
- `features/courses/components/lesson-viewer.tsx` — Uses `isCompleted` (V2 field name) in `updateProgress` call; no role checks needed in viewer
- `app/(dashboard)/courses/[courseId]/enrollments/page.tsx` — Uses `isSuperAdmin` and `currentRole`; `canView` and `canGrantAccess` flags

---

## FE-5.5: Update Settings Page for V2

**Completed:** 2026-02-23

### Summary
Updated the settings page to show full multi-tenant membership information. Added a "Tenant Memberships" section listing all tenant memberships with name, slug, role badge, active/suspended status, and an "Active" indicator for the current tenant. Added a Super Admin notice card for platform admins. Updated the Account section to show "Active Tenant" with a "Global access" fallback for Super Admins without a selected tenant. Replaced single `currentTenant` selector with direct `tenants` array + `currentTenantId` from auth store.

### Files Modified
- `app/(dashboard)/settings/page.tsx` — Added `ShieldCheck` import; replaced `currentTenant` selector with `tenants` array + `currentTenantId`; updated Account card to show "Active Tenant" with global access fallback; added Tenant Memberships list (name, slug, role badge, active/suspended indicators); added Super Admin notice card

---

## FE-6.1: Update Environment Configuration

**Completed:** 2026-02-23

### Summary
Removed `NEXT_PUBLIC_DEFAULT_TENANT_SLUG` from both `.env.local` and `.env.example` — no longer needed since login no longer requires a tenant slug. Added `NEXT_PUBLIC_GLOBAL_DOMAIN=localhost:3001` for the global (non-tenant) domain used in development.

### Files Modified
- `.env.local` — Removed `NEXT_PUBLIC_DEFAULT_TENANT_SLUG=demo`; added `NEXT_PUBLIC_GLOBAL_DOMAIN=localhost:3001`
- `.env.example` — Removed `NEXT_PUBLIC_DEFAULT_TENANT_SLUG=demo`; added `NEXT_PUBLIC_GLOBAL_DOMAIN=localhost:3001`

---

## FE-6.2: Update API Client for Subdomain Routing

**Completed:** 2026-02-23

### Summary
Verified that `lib/api/client.ts` was already correct for V2. The client uses `credentials: 'include'` on all requests (httpOnly cookies sent automatically), injects `x-tenant-id` header from the tenant store, has no `Authorization: Bearer` token logic, and handles 401 by attempting a cookie-based refresh via `POST /auth/refresh`. No changes required.

### Files Verified (no changes needed)
- `lib/api/client.ts` — `credentials: 'include'` on all requests; `x-tenant-id` header from tenant store; no Bearer token logic; 401 → `POST /auth/refresh` (cookie-based); `onAuthError` clears auth store and redirects to `/login`

---

## FE-7.1: Add Loading Skeletons for New Pages

**Completed:** 2026-02-23

### Summary
Verified that all new page loading skeletons were already created as part of FE-4.1–FE-4.4. The only missing skeleton was `app/(dashboard)/roles/[roleId]/loading.tsx` (the role edit/detail page), which was created.

### Files Verified (already existed)
- `app/(dashboard)/members/loading.tsx` — Created in FE-4.1
- `app/(dashboard)/members/[memberId]/loading.tsx` — Created in FE-4.1
- `app/(dashboard)/invitations/loading.tsx` — Created in FE-4.2
- `app/(dashboard)/roles/loading.tsx` — Created in FE-4.3
- `app/(dashboard)/permissions/loading.tsx` — Created in FE-4.4
- `app/(dashboard)/role-permissions/loading.tsx` — Created in FE-4.4

### Files Created
- `app/(dashboard)/roles/[roleId]/loading.tsx` — Loading skeleton for role edit page: header, form card with name/description fields, action buttons

---

## FE-7.2: Add Toast Notifications for New Mutations

**Completed:** 2026-02-23

### Summary
Verified that all mutation hooks already include success and error toast notifications. All hooks use `sonner` toast with descriptive messages.

### Files Verified (no changes needed)
- `features/auth/hooks/use-switch-tenant.ts` — "Switched to [tenant name]" + role description toast
- `features/members/hooks/use-change-role.ts` — "Role updated" toast
- `features/members/hooks/use-suspend-member.ts` — "Member suspended" / "Member activated" toasts
- `features/members/hooks/use-remove-member.ts` — "Member removed" toast
- `features/invitations/hooks/use-create-invitation.ts` — "Invitation sent to [email]" toast
- `features/invitations/hooks/use-cancel-invitation.ts` — "Invitation cancelled" toast
- `features/invitations/hooks/use-accept-invitation.ts` — "Invitation accepted!" toast
- `features/roles/hooks/use-create-role.ts` — "Role created" toast
- `features/roles/hooks/use-update-role.ts` — "Role updated" toast
- `features/roles/hooks/use-delete-role.ts` — "Role deleted" toast
- `features/permissions/hooks/use-create-permission.ts` — "Permission created" toast
- `features/permissions/hooks/use-delete-permission.ts` — "Permission deleted" toast
- `features/permissions/hooks/use-assign-permission.ts` — "Permission assigned" toast
- `features/permissions/hooks/use-remove-role-permission.ts` — "Permission removed" toast

