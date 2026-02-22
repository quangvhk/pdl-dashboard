/**
 * Auth Service — Task 2.3
 * Typed service functions for authentication endpoints.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest, TokensResponse } from '@/types'

export const authService = {
  /**
   * Authenticate a user and receive access + refresh tokens.
   */
  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(ENDPOINTS.auth.login, data),

  /**
   * Register a new user account.
   */
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(ENDPOINTS.auth.register, data),

  /**
   * Exchange a refresh token for a new token pair.
   */
  refresh: (refreshToken: string): Promise<TokensResponse> =>
    apiClient.post<TokensResponse>(ENDPOINTS.auth.refresh, { refreshToken }),

  /**
   * Invalidate the current session on the server.
   */
  logout: (): Promise<void> =>
    apiClient.post<void>(ENDPOINTS.auth.logout),

  /**
   * Fetch the currently authenticated user's profile.
   */
  getMe: (): Promise<AuthUser> =>
    apiClient.get<AuthUser>(ENDPOINTS.auth.me),
}
