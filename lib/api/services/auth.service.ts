/**
 * Auth Service — FE-1.5 V2 Update
 * Typed service functions for authentication endpoints.
 * Cookie-based auth: no tokens in request/response body.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  RefreshResponse,
  LogoutResponse,
  SwitchTenantRequest,
  SwitchTenantResponse,
} from '@/types'

export const authService = {
  /**
   * Authenticate a user. Returns user + tenants list.
   * Tokens are set in HttpOnly cookies by the backend.
   */
  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(ENDPOINTS.auth.login, data),

  /**
   * Register a new user account. Returns user (no tenants — new user has none).
   * Tokens are set in HttpOnly cookies by the backend.
   */
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(ENDPOINTS.auth.register, data),

  /**
   * Switch the active tenant context. Issues a new JWT scoped to the selected tenant.
   * Returns the new tenant context (tenantId, tenantSlug, roleName, roleId).
   */
  switchTenant: (data: SwitchTenantRequest): Promise<SwitchTenantResponse> =>
    apiClient.post<SwitchTenantResponse>(ENDPOINTS.auth.switchTenant, data),

  /**
   * Refresh the session (cookie-based — no body needed).
   * Returns { success: boolean }.
   */
  refresh: (): Promise<RefreshResponse> =>
    apiClient.post<RefreshResponse>(ENDPOINTS.auth.refresh),

  /**
   * Invalidate the current session and clear cookies.
   */
  logout: (): Promise<LogoutResponse> =>
    apiClient.post<LogoutResponse>(ENDPOINTS.auth.logout),

  /**
   * Fetch the currently authenticated user's profile + tenants list.
   */
  getMe: (): Promise<AuthUser> =>
    apiClient.get<AuthUser>(ENDPOINTS.auth.me),
}
