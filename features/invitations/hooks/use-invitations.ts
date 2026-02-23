'use client'

import { useQuery } from '@tanstack/react-query'
import { invitationsService } from '@/lib/api/services/invitations.service'

export const invitationsQueryKeys = {
  all: ['invitations'] as const,
  lists: () => [...invitationsQueryKeys.all, 'list'] as const,
  list: () => [...invitationsQueryKeys.lists()] as const,
}

export function useInvitations() {
  return useQuery({
    queryKey: invitationsQueryKeys.list(),
    queryFn: () => invitationsService.list(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
