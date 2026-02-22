export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL'

export interface Tenant {
  id: string
  name: string
  slug: string
  domain: string | null
  settings: Record<string, unknown>
  status: TenantStatus
  createdAt: string
  updatedAt: string
}

export interface CreateTenantRequest {
  name: string
  slug: string
  domain?: string
  settings?: Record<string, unknown>
}

export interface UpdateTenantRequest {
  name?: string
  domain?: string | null
  settings?: Record<string, unknown>
}

export interface UpdateTenantStatusRequest {
  status: TenantStatus
}
