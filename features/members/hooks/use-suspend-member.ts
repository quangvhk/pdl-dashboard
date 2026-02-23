'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { membersService } from '@/lib/api/services/members.service'
import { membersQueryKeys } from './use-members'

export function useSuspendMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (memberId: string) => membersService.suspend(memberId),
    onSuccess: (updatedMember) => {
      queryClient.setQueryData(membersQueryKeys.detail(updatedMember.id), updatedMember)
      queryClient.invalidateQueries({ queryKey: membersQueryKeys.lists() })
      toast.success('Member suspended', {
        description: 'The member can no longer access tenant resources.',
      })
    },
    onError: (err) => {
      toast.error('Failed to suspend member', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}

export function useActivateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (memberId: string) => membersService.activate(memberId),
    onSuccess: (updatedMember) => {
      queryClient.setQueryData(membersQueryKeys.detail(updatedMember.id), updatedMember)
      queryClient.invalidateQueries({ queryKey: membersQueryKeys.lists() })
      toast.success('Member activated', {
        description: 'The member can now access tenant resources again.',
      })
    },
    onError: (err) => {
      toast.error('Failed to activate member', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
