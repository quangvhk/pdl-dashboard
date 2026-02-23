'use client'

import { useQuery } from '@tanstack/react-query'
import { rolesService } from '@/lib/api/services/roles.service'
import { rolesQueryKeys } from './use-roles'

export function useRole(roleId: string) {
  return useQuery({
    queryKey: rolesQueryKeys.detail(roleId),
    queryFn: () => rolesService.getById(roleId),
    enabled: !!roleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
