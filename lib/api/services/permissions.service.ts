/**
 * Permissions Service — FE-1.5
 * Typed service functions for permission catalog and role-permission assignment endpoints.
 * Permission catalog management: Super Admin only.
 * Role-permission assignments: Tenant Admin + Super Admin.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type {
  Permission,
  CreatePermissionRequest,
  RolePermission,
  AssignPermissionRequest,
} from '@/types'

export const permissionsService = {
  // ─── Permission Catalog ───────────────────────────────────────────────────

  /**
   * List all permissions in the platform catalog.
   */
  list: (): Promise<Permission[]> =>
    apiClient.get<Permission[]>(ENDPOINTS.permissions.list),

  /**
   * Get a single permission by ID.
   */
  getById: (id: string): Promise<Permission> =>
    apiClient.get<Permission>(ENDPOINTS.permissions.detail(id)),

  /**
   * Create a new permission in the catalog (Super Admin only).
   */
  create: (data: CreatePermissionRequest): Promise<Permission> =>
    apiClient.post<Permission>(ENDPOINTS.permissions.create, data),

  /**
   * Delete a permission from the catalog (Super Admin only).
   */
  remove: (id: string): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.permissions.delete(id)),

  // ─── Role-Permission Assignments ──────────────────────────────────────────

  /**
   * List role-permission assignments, optionally filtered by roleId.
   */
  listRolePermissions: (params?: { roleId?: string }): Promise<RolePermission[]> =>
    apiClient.get<RolePermission[]>(
      ENDPOINTS.rolePermissions.list,
      params as Record<string, string | undefined>,
    ),

  /**
   * Assign a permission to a role within the current tenant (Tenant Admin only).
   */
  assignPermission: (data: AssignPermissionRequest): Promise<RolePermission> =>
    apiClient.post<RolePermission>(ENDPOINTS.rolePermissions.assign, data),

  /**
   * Remove a role-permission assignment by its ID.
   */
  removeRolePermission: (id: string): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.rolePermissions.remove(id)),
}
