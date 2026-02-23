'use client'

import { use } from 'react'
import Link from 'next/link'
import { ChevronLeft, AlertCircle, Lock } from 'lucide-react'
import { useRole } from '@/features/roles/hooks/use-role'
import { RoleForm } from '@/features/roles/components/role-form'
import { PageHeader } from '@/components/shared/page-header'
import { RoleGate } from '@/components/shared/role-gate'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Inner component (needs roleId from params) ────────────────────────────────

function RoleDetailContent({ roleId }: { roleId: string }) {
  const { data: role, isLoading, isError } = useRole(roleId)

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-lg">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    )
  }

  if (isError || !role) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Failed to load role. Please try again.
      </div>
    )
  }

  // System roles cannot be edited
  if (role.isSystem) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
        <Lock className="h-4 w-4 shrink-0" />
        <span>
          <strong>{role.name}</strong> is a system role and cannot be edited or deleted.
        </span>
      </div>
    )
  }

  return <RoleForm role={role} />
}

// ─── Page ──────────────────────────────────────────────────────────────────────

interface RoleDetailPageProps {
  params: Promise<{ roleId: string }>
}

export default function RoleDetailPage({ params }: RoleDetailPageProps) {
  const { roleId } = use(params)

  return (
    <RoleGate allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <PageHeader
          title="Edit Role"
          description="Update the name or description of this custom role."
          actions={
            <Button variant="outline" size="sm" asChild>
              <Link href="/roles">
                <ChevronLeft className="mr-1.5 h-4 w-4" />
                Back to Roles
              </Link>
            </Button>
          }
        />
        <RoleDetailContent roleId={roleId} />
      </div>
    </RoleGate>
  )
}
