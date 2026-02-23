'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authService } from '@/lib/api/services/auth.service'
import { useAuthStore, selectCurrentTenant } from '@/stores/auth.store'
import { useTenantStore } from '@/stores/tenant.store'
import type { SwitchTenantRequest } from '@/types'

/**
 * Mutation hook for switching the active tenant context.
 *
 * On success:
 * - Calls POST /auth/switch-tenant to issue a new tenant-scoped JWT (cookie)
 * - Updates auth store: currentTenantId, currentRole, currentRoleId
 * - Syncs tenant store: tenantId, tenantSlug, tenantName
 * - Invalidates all React Query cache (all data is tenant-scoped)
 * - Shows a success toast with the new tenant name
 */
export function useSwitchTenant() {
  const queryClient = useQueryClient()
  const { switchTenant, tenants } = useAuthStore()
  const { setFromAuthStore } = useTenantStore()

  return useMutation({
    mutationFn: (data: SwitchTenantRequest) => authService.switchTenant(data),
    onSuccess: (response, variables) => {
      // Update auth store with new tenant context
      switchTenant(response)

      // Find the tenant name from the tenants list for the tenant store sync
      const tenant = tenants.find((t) => t.tenantId === variables.tenantId)
      const tenantName = tenant?.tenantName ?? ''
      setFromAuthStore(response.tenantId, response.tenantSlug, tenantName)

      // Invalidate all cached data — everything is tenant-scoped
      queryClient.invalidateQueries()

      toast.success(`Switched to ${tenantName || response.tenantSlug}`, {
        description: `You are now acting as ${response.roleName}`,
      })
    },
    onError: (err) => {
      toast.error('Failed to switch tenant', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
