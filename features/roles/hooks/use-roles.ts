'use client'

import { useQuery } from '@tanstack/react-query'
import { rolesService } from '@/lib/api/services/roles.service'

export const rolesQueryKeys = {
  all: ['roles'] as const,
  lists: () => [...rolesQueryKeys.all, 'list'] as const,
  list: () => [...rolesQueryKeys.lists()] as const,
  details: () => [...rolesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...rolesQueryKeys.details(), id] as const,
}

export function useRoles() {
  return useQuery({
    queryKey: rolesQueryKeys.list(),
    queryFn: () => rolesService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes — roles change infrequently
  })
}
