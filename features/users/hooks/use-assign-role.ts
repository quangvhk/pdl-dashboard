'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService } from '@/lib/api/services/users.service'
import { usersQueryKeys } from './use-users'
import type { AssignRoleRequest } from '@/types'

export function useAssignRole(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AssignRoleRequest) => usersService.assignRole(userId, data),
    onSuccess: (updatedUser) => {
      // Update the detail cache directly
      queryClient.setQueryData(usersQueryKeys.detail(userId), updatedUser)
      // Invalidate lists so role changes are reflected
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() })
      toast.success('Role assigned', {
        description: `Role has been assigned to ${updatedUser.firstName} ${updatedUser.lastName}.`,
      })
    },
    onError: (err) => {
      toast.error('Failed to assign role', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}

export function useRemoveRole(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roleId: string) => usersService.removeRole(userId, roleId),
    onSuccess: (updatedUser) => {
      // Update the detail cache directly
      queryClient.setQueryData(usersQueryKeys.detail(userId), updatedUser)
      // Invalidate lists so role changes are reflected
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() })
      toast.success('Role removed', {
        description: `Role has been removed from ${updatedUser.firstName} ${updatedUser.lastName}.`,
      })
    },
    onError: (err) => {
      toast.error('Failed to remove role', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
