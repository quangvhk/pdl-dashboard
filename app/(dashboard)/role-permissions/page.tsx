'use client'

import { useAuthStore } from '@/stores/auth.store'
import { RolePermissionTable } from '@/features/permissions/components/role-permission-table'
import { PageHeader } from '@/components/shared/page-header'
import { RoleGate } from '@/components/shared/role-gate'

export default function RolePermissionsPage() {
  const currentTenantId = useAuthStore((s) => s.currentTenantId)

  return (
    <RoleGate allowedRoles={['TENANT_ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <PageHeader
          title="Role Permissions"
          description="Manage which permissions are assigned to each role within this tenant."
        />

        {!currentTenantId ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <p className="text-sm font-medium text-muted-foreground">No tenant selected</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Select a tenant from the header to manage role-permission assignments.
            </p>
          </div>
        ) : (
          <RolePermissionTable />
        )}
      </div>
    </RoleGate>
  )
}
