'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
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
    },
  })
}
