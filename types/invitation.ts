export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED'

export interface InvitationTenant {
  name: string
  slug: string
}

export interface Invitation {
  id: string
  tenantId: string
  email: string
  roleId: string
  roleName: string
  status: InvitationStatus
  invitedBy: string
  expiresAt: string
  createdAt: string
  tenant?: InvitationTenant
}

export interface CreateInvitationRequest {
  email: string
  roleId: string
}

export interface AcceptInvitationRequest {
  token: string
}
