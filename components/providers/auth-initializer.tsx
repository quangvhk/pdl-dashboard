'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/lib/api/services/auth.service'

// Routes that don't require authentication check
const PUBLIC_ROUTES = ['/', '/login', '/register']

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { setUser, logout, setInitialized, isInitialized } = useAuthStore()

  useEffect(() => {
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
        // Fetch current user profile (cookies sent automatically)
        const user = await authService.getMe()
        setUser(user)
      } catch {
        // Not authenticated or session expired
        logout()
      } finally {
        setInitialized(true)
      }
    }

    initialize()
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
