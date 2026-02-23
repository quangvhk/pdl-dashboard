export interface Permission {
  id: string
  action: string
  subject: string
  conditions?: object | null
  inverted: boolean
  reason?: string | null
}

export interface CreatePermissionRequest {
  action: string
  subject: string
  conditions?: object
  inverted?: boolean
  reason?: string
}

export interface RolePermission {
  id: string
  roleId: string
  roleName: string
  permissionId: string
  action: string
  subject: string
  tenantId: string
}

export interface AssignPermissionRequest {
  roleId: string
  permissionId: string
}
