'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { invitationsService } from '@/lib/api/services/invitations.service'
import { invitationsQueryKeys } from './use-invitations'
import type { CreateInvitationRequest } from '@/types'

export function useCreateInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateInvitationRequest) => invitationsService.create(data),
    onSuccess: (invitation) => {
      queryClient.invalidateQueries({ queryKey: invitationsQueryKeys.lists() })
      toast.success('Invitation sent', {
        description: `An invitation has been sent to ${invitation.email}.`,
      })
    },
    onError: (err) => {
      toast.error('Failed to send invitation', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
