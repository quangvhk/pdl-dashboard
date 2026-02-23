'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { membersService } from '@/lib/api/services/members.service'
import { membersQueryKeys } from './use-members'
import type { ChangeRoleRequest } from '@/types'

export function useChangeRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ memberId, data }: { memberId: string; data: ChangeRoleRequest }) =>
      membersService.changeRole(memberId, data),
    onSuccess: (updatedMember) => {
      // Update the detail cache
      queryClient.setQueryData(membersQueryKeys.detail(updatedMember.id), updatedMember)
      // Invalidate the list so it re-fetches with updated role
      queryClient.invalidateQueries({ queryKey: membersQueryKeys.lists() })
      toast.success('Role updated', {
        description: `Member role has been changed to ${updatedMember.roleName}.`,
      })
    },
    onError: (err) => {
      toast.error('Failed to update role', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
