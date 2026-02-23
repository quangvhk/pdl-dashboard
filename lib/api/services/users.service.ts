/**
 * Users Service — Task 2.3 (updated for V2)
 * Typed service functions for user management endpoints.
 * Note: create(), assignRole(), removeRole() removed — replaced by Members + Invitations modules.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type {
  User,
  UpdateUserRequest,
  PaginationParams,
} from '@/types'

export const usersService = {
  /**
   * List users with optional pagination and filters.
   */
  list: (params?: PaginationParams & { search?: string; isActive?: boolean }): Promise<User[]> =>
    apiClient.get<User[]>(
      ENDPOINTS.users.list,
      params as Record<string, string | number | boolean | undefined | null>,
    ),

  /**
   * Get a single user by ID.
   */
  getById: (id: string): Promise<User> =>
    apiClient.get<User>(ENDPOINTS.users.detail(id)),

  /**
   * Update a user's profile fields.
   */
  update: (id: string, data: UpdateUserRequest): Promise<User> =>
    apiClient.patch<User>(ENDPOINTS.users.update(id), data),

  /**
   * Deactivate (soft-delete) a user account.
   */
  deactivate: (id: string): Promise<User> =>
    apiClient.delete<User>(ENDPOINTS.users.deactivate(id)),
}
