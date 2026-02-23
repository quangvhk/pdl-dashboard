import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface TenantState {
  // State — mirrors the current tenant from auth store
  tenantId: string | null
  tenantSlug: string | null
  tenantName: string | null

  // Actions
  /**
   * Sync tenant state from the auth store's current tenant.
   * Call this after switchTenant() resolves in the auth store.
   */
  setFromAuthStore: (tenantId: string, tenantSlug: string, tenantName: string) => void
  /**
   * Directly set tenant (kept for backward compat with API client).
   */
  setTenant: (id: string, slug: string, name: string) => void
  /** Clear all tenant state (called on logout). */
  clearTenant: () => void
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenantId: null,
      tenantSlug: null,
      tenantName: null,

      setFromAuthStore: (tenantId, tenantSlug, tenantName) => {
        set({ tenantId, tenantSlug, tenantName })
      },

      setTenant: (id, slug, name) => {
        set({ tenantId: id, tenantSlug: slug, tenantName: name })
      },

      clearTenant: () => {
        set({ tenantId: null, tenantSlug: null, tenantName: null })
      },
    }),
    {
      name: 'pandalang-tenant',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
