'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authService } from '@/lib/api/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { useTenantStore } from '@/stores/tenant.store'
import type { RegisterRequest } from '@/types'

/**
 * Mutation hook for new user registration.
 *
 * On success:
 * - Stores user in auth store (tokens set in HttpOnly cookies by backend)
 * - Stores tenant context in tenant store
 * - Redirects to /dashboard
 */
export function useRegister() {
  const router = useRouter()
  const { login } = useAuthStore()
  const { setTenant } = useTenantStore()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      // Store user (tokens set in HttpOnly cookies by backend)
      login(response.user)

      // Persist tenant context derived from the registered user
      setTenant(
        response.user.tenantId,
        '', // tenantSlug not returned by register endpoint
        '',
      )

      toast.success('Account created!', {
        description: `Welcome to Pandalang, ${response.user.firstName}!`,
      })

      router.push('/dashboard')
    },
    onError: (err) => {
      toast.error('Registration failed', {
        description: err instanceof Error ? err.message : 'Could not create account. Please try again.',
      })
    },
  })
}
