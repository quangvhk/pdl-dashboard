'use client'

import { useQuery } from '@tanstack/react-query'
import { membersService } from '@/lib/api/services/members.service'
import type { ListMembersParams } from '@/types'

export const membersQueryKeys = {
  all: ['members'] as const,
  lists: () => [...membersQueryKeys.all, 'list'] as const,
  list: (params?: ListMembersParams) => [...membersQueryKeys.lists(), params] as const,
  details: () => [...membersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...membersQueryKeys.details(), id] as const,
}

export function useMembers(params?: ListMembersParams) {
  return useQuery({
    queryKey: membersQueryKeys.list(params),
    queryFn: () => membersService.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
