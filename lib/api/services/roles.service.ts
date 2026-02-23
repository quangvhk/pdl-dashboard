/**
 * Roles Service — FE-1.5
 * Typed service functions for platform role management endpoints.
 * Super Admin only.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type {
  PlatformRole,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '@/types'

export const rolesService = {
  /**
   * List all platform roles.
   */
  list: (): Promise<PlatformRole[]> =>
    apiClient.get<PlatformRole[]>(ENDPOINTS.roles.list),

  /**
   * Get a single role by ID.
   */
  getById: (id: string): Promise<PlatformRole> =>
    apiClient.get<PlatformRole>(ENDPOINTS.roles.detail(id)),

  /**
   * Create a new custom platform role (Super Admin only).
   */
  create: (data: CreateRoleRequest): Promise<PlatformRole> =>
    apiClient.post<PlatformRole>(ENDPOINTS.roles.create, data),

  /**
   * Update an existing custom role (system roles cannot be modified).
   */
  update: (id: string, data: UpdateRoleRequest): Promise<PlatformRole> =>
    apiClient.patch<PlatformRole>(ENDPOINTS.roles.update(id), data),

  /**
   * Delete a custom role (system roles cannot be deleted).
   */
  remove: (id: string): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.roles.delete(id)),
}
