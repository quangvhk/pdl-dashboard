export interface PlatformRole {
  id: string
  name: string
  description?: string | null
  isSystem: boolean
  createdAt: string
}

export interface CreateRoleRequest {
  name: string
  description?: string
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
}
