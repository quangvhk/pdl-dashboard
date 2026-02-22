'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authService } from '@/lib/api/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { useTenantStore } from '@/stores/tenant.store'

/**
 * Mutation hook for user logout.
 *
 * On success (or failure — always clears local state):
 * - Calls server logout endpoint to clear HttpOnly cookies
 * - Clears auth store (user)
 * - Clears tenant store
 * - Clears all React Query cache
 * - Redirects to /login
 */
export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()
  const { clearTenant } = useTenantStore()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      // Always clear local state regardless of server response
      logout()
      clearTenant()
      queryClient.clear()
      toast.success('Signed out successfully')
      router.push('/login')
    },
  })
}
