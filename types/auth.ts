export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  tenantId: string
  roles: string[]
  isActive: boolean
}

export interface AuthResponse {
  user: AuthUser
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
  tenantSlug: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  tenantSlug: string
}
