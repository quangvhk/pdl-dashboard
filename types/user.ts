export interface UserTenantSummary {
  tenantId: string
  tenantName: string
  tenantSlug: string
  roleName: string
  roleId: string
  status: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar: string | null
  isActive: boolean
  isSuperAdmin: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  tenants: UserTenantSummary[]
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  avatar?: string | null
}
