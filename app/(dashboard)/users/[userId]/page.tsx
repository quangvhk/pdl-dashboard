'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'
import { UserDetail } from '@/features/users/components/user-detail'
import { useAuthStore } from '@/stores/auth.store'

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = use(params)
  const router = useRouter()
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin)
  const currentRole = useAuthStore((s) => s.currentRole)

  const canManageUsers = isSuperAdmin || currentRole === 'TENANT_ADMIN'

  // ── Access denied ─────────────────────────────────────────────────────────────
  if (!canManageUsers) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="bg-muted rounded-full p-4">
          <Lock className="text-muted-foreground h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold">Access Restricted</h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          Only administrators can view user details.
        </p>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Details"
        description="View and manage this user's profile and roles."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        }
      />

      <UserDetail userId={userId} />
    </div>
  )
}
