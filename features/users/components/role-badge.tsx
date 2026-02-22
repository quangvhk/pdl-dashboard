'use client'

import { Badge } from '@/components/ui/badge'

// Role name as returned by the API (role.name field on User.roles[])
type RoleName = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'INSTRUCTOR' | 'STUDENT' | string

const ROLE_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  SUPER_ADMIN: 'destructive',
  TENANT_ADMIN: 'default',
  INSTRUCTOR: 'secondary',
  STUDENT: 'outline',
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  TENANT_ADMIN: 'Admin',
  INSTRUCTOR: 'Instructor',
  STUDENT: 'Student',
}

interface RoleBadgeProps {
  role: RoleName
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const variant = ROLE_VARIANT[role] ?? 'outline'
  const label = ROLE_LABEL[role] ?? role

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}
