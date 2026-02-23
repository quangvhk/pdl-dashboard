/**
 * Members Service — FE-1.5
 * Typed service functions for tenant member management endpoints.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type {
  Member,
  ChangeRoleRequest,
  ListMembersParams,
} from '@/types'

export const membersService = {
  /**
   * List members of the current tenant with optional pagination and filters.
   */
  list: (params?: ListMembersParams): Promise<Member[]> =>
    apiClient.get<Member[]>(
      ENDPOINTS.members.list,
      params as Record<string, string | number | boolean | undefined | null>,
    ),

  /**
   * Get a single member by ID.
   */
  getById: (id: string): Promise<Member> =>
    apiClient.get<Member>(ENDPOINTS.members.detail(id)),

  /**
   * Change a member's role within the current tenant.
   */
  changeRole: (id: string, data: ChangeRoleRequest): Promise<Member> =>
    apiClient.patch<Member>(ENDPOINTS.members.changeRole(id), data),

  /**
   * Suspend a member (prevents access to tenant resources).
   */
  suspend: (id: string): Promise<Member> =>
    apiClient.patch<Member>(ENDPOINTS.members.suspend(id)),

  /**
   * Activate a previously suspended member.
   */
  activate: (id: string): Promise<Member> =>
    apiClient.patch<Member>(ENDPOINTS.members.activate(id)),

  /**
   * Remove a member from the current tenant.
   */
  remove: (id: string): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.members.remove(id)),
}
