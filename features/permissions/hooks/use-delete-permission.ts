'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { permissionsService } from '@/lib/api/services/permissions.service'
import { permissionsQueryKeys } from './use-permissions'

export function useDeletePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (permissionId: string) => permissionsService.remove(permissionId),
    onSuccess: (_data, permissionId) => {
      // Remove from detail cache
      queryClient.removeQueries({ queryKey: permissionsQueryKeys.detail(permissionId) })
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: permissionsQueryKeys.lists() })
      toast.success('Permission deleted', {
        description: 'The permission has been deleted successfully.',
      })
    },
    onError: (err) => {
      toast.error('Failed to delete permission', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
