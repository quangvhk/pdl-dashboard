import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface TenantState {
  // State
  tenantId: string | null
  tenantSlug: string | null
  tenantName: string | null

  // Actions
  setTenant: (id: string, slug: string, name: string) => void
  clearTenant: () => void
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenantId: null,
      tenantSlug: null,
      tenantName: null,

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
