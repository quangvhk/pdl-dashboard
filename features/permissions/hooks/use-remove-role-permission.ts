'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { permissionsService } from '@/lib/api/services/permissions.service'
import { rolePermissionsQueryKeys } from './use-role-permissions'

export function useRemoveRolePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (rolePermissionId: string) =>
      permissionsService.removeRolePermission(rolePermissionId),
    onSuccess: () => {
      // Invalidate all role-permission lists
      queryClient.invalidateQueries({ queryKey: rolePermissionsQueryKeys.lists() })
      toast.success('Permission removed', {
        description: 'The permission assignment has been removed successfully.',
      })
    },
    onError: (err) => {
      toast.error('Failed to remove permission', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
