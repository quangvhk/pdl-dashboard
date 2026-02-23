'use client'

import { useAuthStore } from '@/stores/auth.store'
import { MemberTable } from '@/features/members/components/member-table'
import { PageHeader } from '@/components/shared/page-header'
import { RoleGate } from '@/components/shared/role-gate'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'

export default function MembersPage() {
  const currentTenantId = useAuthStore((s) => s.currentTenantId)

  // No tenant context — show a message
  if (!currentTenantId) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-muted-foreground text-sm">
          Select a tenant to manage its members.
        </p>
      </div>
    )
  }

  return (
    <RoleGate allowedRoles={['TENANT_ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <PageHeader
          title="Members"
          description="Manage the members of this tenant."
          actions={
            <Button asChild>
              <Link href="/invitations/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Link>
            </Button>
          }
        />
        <MemberTable />
      </div>
    </RoleGate>
  )
}
