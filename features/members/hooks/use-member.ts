'use client'

import { useQuery } from '@tanstack/react-query'
import { membersService } from '@/lib/api/services/members.service'
import { membersQueryKeys } from './use-members'

export function useMember(memberId: string) {
  return useQuery({
    queryKey: membersQueryKeys.detail(memberId),
    queryFn: () => membersService.getById(memberId),
    enabled: !!memberId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
