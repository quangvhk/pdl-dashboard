'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PermissionForm } from '@/features/permissions/components/permission-form'
import { PageHeader } from '@/components/shared/page-header'
import { RoleGate } from '@/components/shared/role-gate'
import { Button } from '@/components/ui/button'

export default function NewPermissionPage() {
  return (
    <RoleGate allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <PageHeader
          title="New Permission"
          description="Create a new permission in the platform catalog."
          actions={
            <Button variant="outline" size="sm" asChild>
              <Link href="/permissions">
                <ChevronLeft className="mr-1.5 h-4 w-4" />
                Back to Permissions
              </Link>
            </Button>
          }
        />
        <PermissionForm />
      </div>
    </RoleGate>
  )
}
