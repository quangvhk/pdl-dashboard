/**
 * Users Service — Task 2.3
 * Typed service functions for user management endpoints.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  AssignRoleRequest,
  PaginationParams,
} from '@/types'

export const usersService = {
  /**
   * List users with optional pagination and filters.
   */
  list: (params?: PaginationParams & { search?: string; role?: string; isActive?: boolean }): Promise<User[]> =>
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
   * Create a new user within the current tenant.
   */
  create: (data: CreateUserRequest): Promise<User> =>
    apiClient.post<User>(ENDPOINTS.users.create, data),

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

  /**
   * Assign a role to a user.
   */
  assignRole: (id: string, data: AssignRoleRequest): Promise<User> =>
    apiClient.post<User>(ENDPOINTS.users.assignRole(id), data),

  /**
   * Remove a role from a user.
   */
  removeRole: (id: string, roleId: string): Promise<User> =>
    apiClient.delete<User>(ENDPOINTS.users.removeRole(id, roleId)),
}
