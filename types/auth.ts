export interface UserTenant {
  tenantId: string
  tenantName: string
  tenantSlug: string
  roleName: string
  roleId: string
  status: string
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  isSuperAdmin: boolean
}

export interface AuthResponse {
  user: AuthUser
  tenants?: UserTenant[]
}

export interface SwitchTenantRequest {
  tenantId: string
}

export interface SwitchTenantResponse {
  tenantId: string
  tenantSlug: string
  roleName: string
  roleId: string
}

export interface RefreshResponse {
  success: boolean
}

export interface LogoutResponse {
  success: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}
