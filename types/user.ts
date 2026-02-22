export interface Role {
  id: string
  name: string
}

export interface User {
  id: string
  tenantId: string
  email: string
  firstName: string
  lastName: string
  avatar: string | null
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  roles: Role[]
}

export interface CreateUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  tenantId?: string
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  avatar?: string | null
}

export interface AssignRoleRequest {
  roleId: string
}
