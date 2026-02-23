'use client'

import { useQuery } from '@tanstack/react-query'
import { permissionsService } from '@/lib/api/services/permissions.service'

export const permissionsQueryKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionsQueryKeys.all, 'list'] as const,
  list: () => [...permissionsQueryKeys.lists()] as const,
  details: () => [...permissionsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...permissionsQueryKeys.details(), id] as const,
}

export function usePermissions() {
  return useQuery({
    queryKey: permissionsQueryKeys.list(),
    queryFn: () => permissionsService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes — permissions change infrequently
  })
}
