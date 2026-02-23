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
   *
   * Uses raw fetch instead of apiClient because the backend returns
   * { success: true } at the top level (no `data` envelope). apiClient
   * unwraps `envelope.data` which yields `undefined`, causing the
   * AuthInitializer to treat a valid session as expired on every page reload.
   */
  refresh: (): Promise<RefreshResponse> =>
    fetch(ENDPOINTS.auth.refresh, {
      method: 'POST',
      credentials: 'include',
    }).then(async (res) => {
      if (!res.ok) return { success: false }
      try {
        const body = await res.json()
        // Backend may return { success: true } directly or wrapped in { data: { success: true } }
        return { success: body?.success ?? body?.data?.success ?? res.ok }
      } catch {
        return { success: res.ok }
      }
    }),

  /**
   * Invalidate the current session and clear cookies.
   *
   * Calls the Next.js API route (/api/auth/logout) instead of the backend
   * directly. The Next.js route forwards the request to the backend AND
   * explicitly clears the HttpOnly cookies via next/headers — this is required
   * because Next.js rewrites do not reliably forward Set-Cookie headers from
   * the backend to the browser, leaving the accessToken cookie intact and
   * causing the middleware to keep redirecting /login → /dashboard.
   */
  logout: (): Promise<LogoutResponse> =>
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).then(
      (res) => res.json() as Promise<LogoutResponse>
    ),

  /**
   * Fetch the currently authenticated user's profile + tenants list.
   */
  getMe: (): Promise<AuthUser> =>
    apiClient.get<AuthUser>(ENDPOINTS.auth.me),
}
