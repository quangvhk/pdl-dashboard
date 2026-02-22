'use client'

import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/lib/api/services/users.service'
import { usersQueryKeys } from './use-users'

export function useUser(userId: string) {
  return useQuery({
    queryKey: usersQueryKeys.detail(userId),
    queryFn: () => usersService.getById(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
