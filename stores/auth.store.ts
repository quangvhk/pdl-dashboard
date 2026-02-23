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

  // Computed (accessed as getters via selectors)
  isAuthenticated: boolean
  isSuperAdmin: boolean
  hasMultipleTenants: boolean

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
    (set, get) => ({
      // Initial state
      user: null,
      tenants: [],
      currentTenantId: null,
      currentRole: null,
      currentRoleId: null,
      isInitialized: false,

      // Computed
      get isAuthenticated() {
        return !!get().user
      },
      get isSuperAdmin() {
        return get().user?.isSuperAdmin ?? false
      },
      get hasMultipleTenants() {
        return get().tenants.length > 1
      },

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
