'use client'

import { useQuery } from '@tanstack/react-query'
import { tenantsService } from '@/lib/api/services/tenants.service'
import type { PaginationParams } from '@/types'

export const tenantsQueryKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantsQueryKeys.all, 'list'] as const,
  list: (params?: PaginationParams & { search?: string }) =>
    [...tenantsQueryKeys.lists(), params] as const,
  details: () => [...tenantsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenantsQueryKeys.details(), id] as const,
}

export interface UseTenantsParams extends PaginationParams {
  search?: string
}

export function useTenants(params?: UseTenantsParams) {
  return useQuery({
    queryKey: tenantsQueryKeys.list(params),
    queryFn: () => tenantsService.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
