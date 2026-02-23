/**
 * Invitations Service — FE-1.5
 * Typed service functions for invitation management endpoints.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type {
  Invitation,
  CreateInvitationRequest,
  AcceptInvitationRequest,
} from '@/types'

export const invitationsService = {
  /**
   * List all invitations for the current tenant.
   */
  list: (): Promise<Invitation[]> =>
    apiClient.get<Invitation[]>(ENDPOINTS.invitations.list),

  /**
   * Create (send) a new invitation to a user by email.
   */
  create: (data: CreateInvitationRequest): Promise<Invitation> =>
    apiClient.post<Invitation>(ENDPOINTS.invitations.create, data),

  /**
   * Cancel a pending invitation.
   */
  cancel: (id: string): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.invitations.cancel(id)),

  /**
   * Accept an invitation using the token from the invitation email.
   * Can be called by authenticated or unauthenticated users.
   */
  accept: (data: AcceptInvitationRequest): Promise<void> =>
    apiClient.post<void>(ENDPOINTS.invitations.accept, data),
}
