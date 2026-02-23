import type { PaginationParams } from './api'

export type MemberStatus = 'ACTIVE' | 'SUSPENDED'

export interface MemberUser {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface Member {
  id: string
  userId: string
  tenantId: string
  roleId: string
  roleName: string
  status: MemberStatus
  joinedAt: string
  user?: MemberUser
}

export interface ChangeRoleRequest {
  roleId: string
}

export interface ListMembersParams extends PaginationParams {
  roleId?: string
  status?: MemberStatus
  search?: string
}
