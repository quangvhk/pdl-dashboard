'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { useTenantStore } from '@/stores/tenant.store'
import { authService } from '@/lib/api/services/auth.service'

// Routes that don't require authentication check
const PUBLIC_ROUTES = ['/', '/login', '/register']

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { switchTenant, logout, setInitialized, isInitialized } = useAuthStore()
  const { setFromAuthStore } = useTenantStore()

  useEffect(() => {
    // Only run once on mount — isInitialized guards re-runs
    if (isInitialized) return

    async function initialize() {
      // Skip auth check on public routes
      const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + '/')
      )

      if (isPublicRoute) {
        setInitialized(true)
        return
      }

      try {
        // Step 1: Refresh the session (cookie sent automatically via credentials: 'include')
        const refreshResult = await authService.refresh()

        // Treat undefined/null as a failed refresh (defensive — apiClient envelope unwrap
        // can return undefined if the backend response has no `data` field)
        if (!refreshResult?.success) {
          logout()
          setInitialized(true)
          return
        }

        // Step 2: Fetch current user profile (refreshes the user object from server)
        const user = await authService.getMe()

        // Step 3: Update user in auth store (tenants are already restored from sessionStorage)
        useAuthStore.getState().setUser(user)

        // Step 4: If currentTenantId is persisted and still valid, re-issue the tenant JWT
        const restoredTenantId = useAuthStore.getState().currentTenantId
        const currentTenants = useAuthStore.getState().tenants

        if (restoredTenantId) {
          const restoredTenant = currentTenants.find((t) => t.tenantId === restoredTenantId)

          if (restoredTenant) {
            // Re-issue the tenant-scoped JWT so the session is fully restored
            const switchResult = await authService.switchTenant({ tenantId: restoredTenantId })
            switchTenant(switchResult)

            // Sync tenant store with the restored tenant context
            setFromAuthStore(
              restoredTenant.tenantId,
              restoredTenant.tenantSlug,
              restoredTenant.tenantName
            )
          } else {
            // Persisted tenantId is no longer in the tenants list — clear tenant context
            logout()
          }
        }
      } catch {
        // Refresh failed or network error — clear all auth state
        logout()
      } finally {
        setInitialized(true)
      }
    }

    initialize()
  }, [isInitialized]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
