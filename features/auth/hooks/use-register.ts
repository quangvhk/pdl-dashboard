'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authService } from '@/lib/api/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import type { RegisterRequest } from '@/types'

/**
 * Mutation hook for new user registration.
 *
 * V2: No tenantSlug in request. New user has no tenants yet — needs invitation.
 * On success: stores user in auth store, redirects to /dashboard.
 */
export function useRegister() {
  const router = useRouter()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      // Store user (tokens set in HttpOnly cookies by backend)
      // New user has no tenants — they need to accept an invitation
      login(response)

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
