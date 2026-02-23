'use client'

import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/lib/api/services/users.service'
import type { PaginationParams } from '@/types'

export const usersQueryKeys = {
  all: ['users'] as const,
  lists: () => [...usersQueryKeys.all, 'list'] as const,
  list: (params?: PaginationParams & { search?: string; isActive?: boolean }) =>
    [...usersQueryKeys.lists(), params] as const,
  details: () => [...usersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersQueryKeys.details(), id] as const,
}

export interface UseUsersParams extends PaginationParams {
  search?: string
  isActive?: boolean
}

export function useUsers(params?: UseUsersParams) {
  return useQuery({
    queryKey: usersQueryKeys.list(params),
    queryFn: () => usersService.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
