'use client'

import { useQuery } from '@tanstack/react-query'
import { authService } from '@/lib/api/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'

/** Stable query key for the current user profile. */
export const currentUserQueryKey = ['auth', 'me'] as const

/**
 * Query hook that fetches the currently authenticated user's profile.
 *
 * - Only enabled when the user is authenticated (has a valid access token).
 * - Keeps the auth store's `user` field in sync via `onSuccess`-equivalent
 *   pattern using `select` + store update in the component layer.
 * - staleTime: 5 minutes — profile data rarely changes mid-session.
 */
export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => !!s.user)
  const setUser = useAuthStore((s) => s.setUser)

  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: async () => {
      const user = await authService.getMe()
      // Keep Zustand store in sync with the latest server-side profile
      setUser(user)
      return user
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
