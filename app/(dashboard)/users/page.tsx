'use client'

import { useRouter } from 'next/navigation'
import { Lock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'
import { UserTable } from '@/features/users/components/user-table'
import { useAuthStore } from '@/stores/auth.store'

export default function UsersPage() {
  const router = useRouter()
  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin ?? false)

  // ── Access denied ─────────────────────────────────────────────────────────────
  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="bg-muted rounded-full p-4">
          <Lock className="text-muted-foreground h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold">Access Restricted</h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          Only Super Admins can view the global user list.
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
        title="Users"
        description="View all global user accounts and their tenant memberships."
      />

      {/* Summary badge */}
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 rounded-md p-1.5">
          <Users className="text-primary h-4 w-4" />
        </div>
        <span className="text-muted-foreground text-sm">All registered users across all tenants</span>
      </div>

      <UserTable />
    </div>
  )
}
