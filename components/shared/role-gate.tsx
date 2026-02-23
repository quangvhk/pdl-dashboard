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
 *
 * V2: reads `currentRole` (single role per tenant) and `isSuperAdmin` from auth store.
 * Super Admin always passes any role gate.
 * If no tenant is selected (`currentRole === null`), access is denied for tenant-scoped pages.
 */
export function RoleGate({ allowedRoles, children, fallback = null }: RoleGateProps) {
  const user = useAuthStore((s) => s.user)
  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin ?? false)
  const currentRole = useAuthStore((s) => s.currentRole)

  if (!user) return <>{fallback}</>

  // Super Admin bypasses all role gates
  if (isSuperAdmin) return <>{children}</>

  // No tenant selected — deny access to tenant-scoped pages
  if (!currentRole) return <>{fallback}</>

  const hasRole = allowedRoles.includes(currentRole as Role)

  return hasRole ? <>{children}</> : <>{fallback}</>
}
