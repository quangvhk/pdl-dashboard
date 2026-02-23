'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { RoleForm } from '@/features/roles/components/role-form'
import { PageHeader } from '@/components/shared/page-header'
import { RoleGate } from '@/components/shared/role-gate'
import { Button } from '@/components/ui/button'

export default function NewRolePage() {
  return (
    <RoleGate allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <PageHeader
          title="New Role"
          description="Create a new custom platform role."
          actions={
            <Button variant="outline" size="sm" asChild>
              <Link href="/roles">
                <ChevronLeft className="mr-1.5 h-4 w-4" />
                Back to Roles
              </Link>
            </Button>
          }
        />
        <RoleForm />
      </div>
    </RoleGate>
  )
}
