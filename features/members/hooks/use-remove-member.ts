'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { membersService } from '@/lib/api/services/members.service'
import { membersQueryKeys } from './use-members'

export function useRemoveMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (memberId: string) => membersService.remove(memberId),
    onSuccess: (_data, memberId) => {
      // Remove from detail cache
      queryClient.removeQueries({ queryKey: membersQueryKeys.detail(memberId) })
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: membersQueryKeys.lists() })
      toast.success('Member removed', {
        description: 'The member has been removed from this tenant.',
      })
    },
    onError: (err) => {
      toast.error('Failed to remove member', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
