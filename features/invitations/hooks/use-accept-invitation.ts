'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { invitationsService } from '@/lib/api/services/invitations.service'
import { invitationsQueryKeys } from './use-invitations'
import type { AcceptInvitationRequest } from '@/types'

export function useAcceptInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AcceptInvitationRequest) => invitationsService.accept(data),
    onSuccess: () => {
      // Invalidate invitations list so it reflects the accepted status
      queryClient.invalidateQueries({ queryKey: invitationsQueryKeys.lists() })
      toast.success('Invitation accepted!', {
        description: 'Welcome! You now have access to the tenant.',
      })
    },
    onError: (err) => {
      toast.error('Failed to accept invitation', {
        description: err instanceof Error ? err.message : 'The invitation may be expired or invalid.',
      })
    },
  })
}
