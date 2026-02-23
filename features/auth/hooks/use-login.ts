'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authService } from '@/lib/api/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import type { LoginRequest } from '@/types'

/**
 * Mutation hook for user login.
 *
 * V2: No tenantSlug in request. On success stores user + tenants list.
 * - If single tenant: auto-switch and redirect to /dashboard
 * - If multiple tenants: redirect to /dashboard (shows tenant picker)
 * - If no tenants: redirect to /dashboard (shows no-tenant state)
 */
export function useLogin(callbackUrl = '/dashboard') {
  const router = useRouter()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      // Store user + tenants (tokens set in HttpOnly cookies by backend)
      login(response)

      toast.success('Welcome back!', {
        description: `Signed in as ${response.user.firstName} ${response.user.lastName}`,
      })

      router.push(callbackUrl)
    },
    onError: (err) => {
      toast.error('Sign in failed', {
        description: err instanceof Error ? err.message : 'Invalid credentials. Please try again.',
      })
    },
  })
}
