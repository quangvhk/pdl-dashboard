'use client'

import { ReactNode } from 'react'
import { useAuthStore } from '@/stores/auth.store'

type Role = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'INSTRUCTOR' | 'STUDENT'

interface RoleGateProps {
  /** Roles that are allowed to see the children */
  allowedRoles: Role[]
  /** Content to render when the user has the required role */
  children: ReactNode
  /** Optional fallback rendered when the user lacks the required role */
  fallback?: ReactNode
}

/**
 * Conditionally renders `children` only when the authenticated user has at
 * least one of the `allowedRoles`. Renders `fallback` (or nothing) otherwise.
 */
export function RoleGate({ allowedRoles, children, fallback = null }: RoleGateProps) {
  const user = useAuthStore((s) => s.user)

  if (!user) return <>{fallback}</>

  const hasRole = user.roles.some((role) => allowedRoles.includes(role as Role))

  return hasRole ? <>{children}</> : <>{fallback}</>
}
