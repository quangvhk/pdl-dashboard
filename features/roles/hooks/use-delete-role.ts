'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { rolesService } from '@/lib/api/services/roles.service'
import { rolesQueryKeys } from './use-roles'

export function useDeleteRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roleId: string) => rolesService.remove(roleId),
    onSuccess: (_data, roleId) => {
      // Remove from detail cache
      queryClient.removeQueries({ queryKey: rolesQueryKeys.detail(roleId) })
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: rolesQueryKeys.lists() })
      toast.success('Role deleted', {
        description: 'The role has been deleted successfully.',
      })
    },
    onError: (err) => {
      toast.error('Failed to delete role', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
