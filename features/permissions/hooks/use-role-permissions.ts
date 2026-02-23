'use client'

import { useQuery } from '@tanstack/react-query'
import { permissionsService } from '@/lib/api/services/permissions.service'

export const rolePermissionsQueryKeys = {
  all: ['role-permissions'] as const,
  lists: () => [...rolePermissionsQueryKeys.all, 'list'] as const,
  list: (params?: { roleId?: string }) =>
    [...rolePermissionsQueryKeys.lists(), params ?? {}] as const,
}

export function useRolePermissions(params?: { roleId?: string }) {
  return useQuery({
    queryKey: rolePermissionsQueryKeys.list(params),
    queryFn: () => permissionsService.listRolePermissions(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
