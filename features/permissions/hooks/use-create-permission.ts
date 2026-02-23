'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { permissionsService } from '@/lib/api/services/permissions.service'
import { permissionsQueryKeys } from './use-permissions'
import type { CreatePermissionRequest } from '@/types'

export function useCreatePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePermissionRequest) => permissionsService.create(data),
    onSuccess: (newPermission) => {
      // Invalidate the list so it re-fetches with the new permission
      queryClient.invalidateQueries({ queryKey: permissionsQueryKeys.lists() })
      toast.success('Permission created', {
        description: `"${newPermission.action}:${newPermission.subject}" has been created successfully.`,
      })
    },
    onError: (err) => {
      toast.error('Failed to create permission', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
