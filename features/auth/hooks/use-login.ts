'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/api/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { useTenantStore } from '@/stores/tenant.store'
import type { LoginRequest } from '@/types'

/**
 * Mutation hook for user login.
 *
 * On success:
 * - Stores tokens + user in auth store (sets auth-status cookie)
 * - Stores tenant info in tenant store
 * - Redirects to /dashboard
 */
export function useLogin(callbackUrl = '/dashboard') {
  const router = useRouter()
  const { login } = useAuthStore()
  const { setTenant } = useTenantStore()

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      // Persist tokens + user; sets auth-status cookie
      login(response)

      // Persist tenant context derived from the authenticated user
      setTenant(
        response.user.tenantId,
        '', // tenantSlug not returned by login — populated from form input if needed
        '',
      )

      router.push(callbackUrl)
    },
  })
}
