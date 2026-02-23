'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { rolesService } from '@/lib/api/services/roles.service'
import { rolesQueryKeys } from './use-roles'
import type { UpdateRoleRequest } from '@/types'

export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: UpdateRoleRequest }) =>
      rolesService.update(roleId, data),
    onSuccess: (updatedRole) => {
      // Update the detail cache
      queryClient.setQueryData(rolesQueryKeys.detail(updatedRole.id), updatedRole)
      // Invalidate the list so it re-fetches with updated data
      queryClient.invalidateQueries({ queryKey: rolesQueryKeys.lists() })
      toast.success('Role updated', {
        description: `"${updatedRole.name}" has been updated successfully.`,
      })
    },
    onError: (err) => {
      toast.error('Failed to update role', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
