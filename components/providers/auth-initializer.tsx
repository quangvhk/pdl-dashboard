'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/lib/api/services/auth.service'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { refreshToken, setTokens, setUser, logout, setInitialized, isInitialized } =
    useAuthStore()

  useEffect(() => {
    async function initialize() {
      if (!refreshToken) {
        setInitialized(true)
        return
      }

      try {
        // Attempt silent token refresh using persisted refresh token
        const tokens = await authService.refresh(refreshToken)
        setTokens(tokens.accessToken, tokens.refreshToken)

        // Fetch current user profile
        const user = await authService.getMe()
        setUser(user)
      } catch {
        // Refresh failed — session expired, clear auth state and cookie
        logout()
      } finally {
        setInitialized(true)
      }
    }

    initialize()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
