/**
 * Tenants Service — Task 2.3
 * Typed service functions for tenant management endpoints.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type {
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
  UpdateTenantStatusRequest,
  PaginationParams,
} from '@/types'

export const tenantsService = {
  /**
   * List all tenants (Super Admin only).
   */
  list: (params?: PaginationParams & { search?: string }): Promise<Tenant[]> =>
    apiClient.get<Tenant[]>(
      ENDPOINTS.tenants.list,
      params as Record<string, string | number | boolean | undefined | null>,
    ),

  /**
   * Get a single tenant by ID.
   */
  getById: (id: string): Promise<Tenant> =>
    apiClient.get<Tenant>(ENDPOINTS.tenants.detail(id)),

  /**
   * Create a new tenant.
   */
  create: (data: CreateTenantRequest): Promise<Tenant> =>
    apiClient.post<Tenant>(ENDPOINTS.tenants.create, data),

  /**
   * Update tenant details.
   */
  update: (id: string, data: UpdateTenantRequest): Promise<Tenant> =>
    apiClient.patch<Tenant>(ENDPOINTS.tenants.update(id), data),

  /**
   * Update tenant status (ACTIVE | SUSPENDED | TRIAL).
   */
  updateStatus: (id: string, data: UpdateTenantStatusRequest): Promise<Tenant> =>
    apiClient.patch<Tenant>(ENDPOINTS.tenants.updateStatus(id), data),
}
