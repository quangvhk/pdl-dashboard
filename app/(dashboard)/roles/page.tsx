'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { RoleTable } from '@/features/roles/components/role-table'
import { PageHeader } from '@/components/shared/page-header'
import { RoleGate } from '@/components/shared/role-gate'
import { Button } from '@/components/ui/button'

export default function RolesPage() {
  return (
    <RoleGate allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <PageHeader
          title="Roles"
          description="Manage platform-wide roles. System roles are protected and cannot be modified."
          actions={
            <Button asChild>
              <Link href="/roles/new">
                <Plus className="mr-2 h-4 w-4" />
                New Role
              </Link>
            </Button>
          }
        />
        <RoleTable />
      </div>
    </RoleGate>
  )
}
