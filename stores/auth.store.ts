import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthUser, AuthResponse, UserTenant, SwitchTenantResponse } from '@/types'

interface AuthState {
  // State
  user: AuthUser | null
  tenants: UserTenant[]
  currentTenantId: string | null
  currentRole: string | null
  currentRoleId: string | null
  isInitialized: boolean

  // Actions
  login: (response: AuthResponse) => void
  setUser: (user: AuthUser) => void
  setTenants: (tenants: UserTenant[]) => void
  switchTenant: (response: SwitchTenantResponse) => void
  logout: () => void
  setInitialized: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      tenants: [],
      currentTenantId: null,
      currentRole: null,
      currentRoleId: null,
      isInitialized: false,

      // Actions
      login: (response: AuthResponse) => {
        set({
          user: response.user,
          tenants: response.tenants ?? [],
        })
      },

      setUser: (user: AuthUser) => {
        set({ user })
      },

      setTenants: (tenants: UserTenant[]) => {
        set({ tenants })
      },

      switchTenant: (response: SwitchTenantResponse) => {
        set({
          currentTenantId: response.tenantId,
          currentRole: response.roleName,
          currentRoleId: response.roleId,
        })
      },

      logout: () => {
        set({
          user: null,
          tenants: [],
          currentTenantId: null,
          currentRole: null,
          currentRoleId: null,
        })
      },

      setInitialized: (value: boolean) => {
        set({ isInitialized: value })
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        tenants: state.tenants,
        currentTenantId: state.currentTenantId,
        currentRole: state.currentRole,
        currentRoleId: state.currentRoleId,
      }),
    },
  ),
)

// ---------------------------------------------------------------------------
// Selectors — use these in components for derived/computed values
// ---------------------------------------------------------------------------

/** Whether the user is authenticated (has a user object). */
export const selectIsAuthenticated = (s: AuthState) => !!s.user

/** Whether the user is a platform super admin. */
export const selectIsSuperAdmin = (s: AuthState) => s.user?.isSuperAdmin ?? false

/** Whether the user belongs to more than one tenant. */
export const selectHasMultipleTenants = (s: AuthState) => s.tenants.length > 1

/** The full UserTenant object for the currently active tenant. */
export const selectCurrentTenant = (s: AuthState) =>
  s.tenants.find((t) => t.tenantId === s.currentTenantId) ?? null

// ---------------------------------------------------------------------------
// Convenience selector hooks — inline selectors for common derived values
// These are used as: useAuthStore(selectIsSuperAdmin)
// But for backward compat with (s) => s.isSuperAdmin pattern, we also
// expose isSuperAdmin as a selector alias on the state shape via augmentation.
// ---------------------------------------------------------------------------

/**
 * Hook that returns isSuperAdmin derived from user state.
 * Usage: const isSuperAdmin = useIsSuperAdmin()
 */
export function useIsSuperAdmin() {
  return useAuthStore(selectIsSuperAdmin)
}

/**
 * Hook that returns the current tenant object.
 * Usage: const currentTenant = useCurrentTenant()
 */
export function useCurrentTenant() {
  return useAuthStore(selectCurrentTenant)
}
