'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authService } from '@/lib/api/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { useTenantStore } from '@/stores/tenant.store'

/**
 * Mutation hook for user logout.
 *
 * On success (or failure — always clears local state):
 * - Calls server logout endpoint to clear HttpOnly cookies
 * - Clears auth store (user) and resets isInitialized
 * - Clears tenant store
 * - Clears all React Query cache
 * - Hard-redirects to /login (full page reload to flush all in-memory state)
 *
 * IMPORTANT: The redirect must happen AFTER the logout fetch completes.
 * window.location.href causes a full page unload which cancels in-flight
 * requests — if called in onSettled before the fetch resolves, the cookie-
 * clearing request never reaches the server.
 */
export function useLogout() {
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()
  const { clearTenant } = useTenantStore()

  return useMutation({
    mutationFn: async () => {
      // Await the server logout so cookies are cleared BEFORE we navigate away.
      // Page unload (window.location.href) cancels in-flight fetch requests.
      await authService.logout()
    },
    onSettled: () => {
      // Always clear local state regardless of server response
      logout()
      clearTenant()
      queryClient.clear()
      toast.success('Signed out successfully')
      // Hard redirect after the fetch has fully completed (mutationFn awaited above)
      window.location.href = '/login'
    },
  })
}
