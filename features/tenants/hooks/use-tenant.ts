'use client'

import { useQuery } from '@tanstack/react-query'
import { tenantsService } from '@/lib/api/services/tenants.service'
import { tenantsQueryKeys } from './use-tenants'

export function useTenant(tenantId: string) {
  return useQuery({
    queryKey: tenantsQueryKeys.detail(tenantId),
    queryFn: () => tenantsService.getById(tenantId),
    enabled: !!tenantId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
