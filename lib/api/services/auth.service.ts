/**
 * Auth Service — Task 2.3
 * Typed service functions for authentication endpoints.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest, RefreshResponse, LogoutResponse } from '@/types'

export const authService = {
  /**
   * Authenticate a user (tokens set in HttpOnly cookies by backend).
   */
  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(ENDPOINTS.auth.login, data),

  /**
   * Register a new user account (tokens set in HttpOnly cookies by backend).
   */
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(ENDPOINTS.auth.register, data),

  /**
   * Refresh tokens (reads refresh token from cookie, sets new tokens in cookies).
   */
  refresh: (): Promise<RefreshResponse> =>
    apiClient.post<RefreshResponse>(ENDPOINTS.auth.refresh),

  /**
   * Invalidate the current session and clear cookies.
   */
  logout: (): Promise<LogoutResponse> =>
    apiClient.post<LogoutResponse>(ENDPOINTS.auth.logout),

  /**
   * Fetch the currently authenticated user's profile.
   */
  getMe: (): Promise<AuthUser> =>
    apiClient.get<AuthUser>(ENDPOINTS.auth.me),
}
