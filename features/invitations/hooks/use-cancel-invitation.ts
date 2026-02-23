'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { invitationsService } from '@/lib/api/services/invitations.service'
import { invitationsQueryKeys } from './use-invitations'

export function useCancelInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invitationId: string) => invitationsService.cancel(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationsQueryKeys.lists() })
      toast.success('Invitation cancelled', {
        description: 'The invitation has been cancelled and is no longer valid.',
      })
    },
    onError: (err) => {
      toast.error('Failed to cancel invitation', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
