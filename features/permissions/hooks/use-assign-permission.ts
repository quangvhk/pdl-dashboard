'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { permissionsService } from '@/lib/api/services/permissions.service'
import { rolePermissionsQueryKeys } from './use-role-permissions'
import type { AssignPermissionRequest } from '@/types'

export function useAssignPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AssignPermissionRequest) => permissionsService.assignPermission(data),
    onSuccess: () => {
      // Invalidate all role-permission lists (any filter combination)
      queryClient.invalidateQueries({ queryKey: rolePermissionsQueryKeys.lists() })
      toast.success('Permission assigned', {
        description: 'The permission has been assigned to the role successfully.',
      })
    },
    onError: (err) => {
      toast.error('Failed to assign permission', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
