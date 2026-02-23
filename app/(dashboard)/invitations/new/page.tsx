'use client'

import { useAuthStore } from '@/stores/auth.store'
import { CreateInvitationForm } from '@/features/invitations/components/create-invitation-form'
import { PageHeader } from '@/components/shared/page-header'
import { RoleGate } from '@/components/shared/role-gate'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewInvitationPage() {
  const currentTenantId = useAuthStore((s) => s.currentTenantId)

  // No tenant context — show a message
  if (!currentTenantId) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-muted-foreground text-sm">
          Select a tenant to send invitations.
        </p>
      </div>
    )
  }

  return (
    <RoleGate allowedRoles={['TENANT_ADMIN', 'INSTRUCTOR', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <PageHeader
          title="Invite Member"
          description="Send an invitation to add a new member to this tenant."
          actions={
            <Button variant="outline" asChild>
              <Link href="/invitations">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Invitations
              </Link>
            </Button>
          }
        />
        <CreateInvitationForm />
      </div>
    </RoleGate>
  )
}
