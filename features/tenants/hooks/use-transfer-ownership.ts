'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { tenantsService } from '@/lib/api/services/tenants.service'
import { tenantsQueryKeys } from '@/features/tenants/hooks/use-tenants'

interface TransferOwnershipVariables {
  tenantId: string
  newOwnerId: string
}

/**
 * Mutation hook to transfer tenant ownership to another user.
 * Only Super Admin or the current owner can perform this action.
 */
export function useTransferOwnership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tenantId, newOwnerId }: TransferOwnershipVariables) =>
      tenantsService.transferOwnership(tenantId, { newOwnerId }),

    onSuccess: (updatedTenant) => {
      // Update detail cache
      queryClient.setQueryData(tenantsQueryKeys.detail(updatedTenant.id), updatedTenant)
      // Invalidate list so owner column refreshes
      queryClient.invalidateQueries({ queryKey: tenantsQueryKeys.lists() })

      toast.success('Ownership transferred', {
        description: `Ownership of "${updatedTenant.name}" has been transferred successfully.`,
      })
    },

    onError: (err) => {
      toast.error('Failed to transfer ownership', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
