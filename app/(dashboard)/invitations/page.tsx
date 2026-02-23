'use client'

import { useAuthStore } from '@/stores/auth.store'
import { InvitationTable } from '@/features/invitations/components/invitation-table'
import { PageHeader } from '@/components/shared/page-header'
import { RoleGate } from '@/components/shared/role-gate'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function InvitationsPage() {
  const currentTenantId = useAuthStore((s) => s.currentTenantId)
  const currentRole = useAuthStore((s) => s.currentRole)
  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin ?? false)

  // No tenant context — show a message
  if (!currentTenantId) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-muted-foreground text-sm">
          Select a tenant to manage its invitations.
        </p>
      </div>
    )
  }

  const canInvite =
    isSuperAdmin || currentRole === 'TENANT_ADMIN' || currentRole === 'INSTRUCTOR'

  return (
    <RoleGate allowedRoles={['TENANT_ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <PageHeader
          title="Invitations"
          description="Manage pending invitations for this tenant."
          actions={
            canInvite ? (
              <Button asChild>
                <Link href="/invitations/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Invite Member
                </Link>
              </Button>
            ) : undefined
          }
        />
        <InvitationTable />
      </div>
    </RoleGate>
  )
}
