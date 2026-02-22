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
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface TokensResponse {
  accessToken: string
  refreshToken: string
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
