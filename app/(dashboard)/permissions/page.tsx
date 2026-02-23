'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PermissionTable } from '@/features/permissions/components/permission-table'
import { PageHeader } from '@/components/shared/page-header'
import { RoleGate } from '@/components/shared/role-gate'
import { Button } from '@/components/ui/button'

export default function PermissionsPage() {
  return (
    <RoleGate allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <PageHeader
          title="Permissions"
          description="Manage the platform-wide permission catalog. Permissions are assigned to roles to control resource access."
          actions={
            <Button asChild>
              <Link href="/permissions/new">
                <Plus className="mr-2 h-4 w-4" />
                New Permission
              </Link>
            </Button>
          }
        />
        <PermissionTable />
      </div>
    </RoleGate>
  )
}
