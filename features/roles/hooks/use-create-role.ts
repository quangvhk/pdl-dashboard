'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { rolesService } from '@/lib/api/services/roles.service'
import { rolesQueryKeys } from './use-roles'
import type { CreateRoleRequest } from '@/types'

export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => rolesService.create(data),
    onSuccess: (newRole) => {
      // Invalidate the list so it re-fetches with the new role
      queryClient.invalidateQueries({ queryKey: rolesQueryKeys.lists() })
      toast.success('Role created', {
        description: `"${newRole.name}" has been created successfully.`,
      })
    },
    onError: (err) => {
      toast.error('Failed to create role', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
