'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/page-header'
import { UserForm } from '@/features/users/components/user-form'
import { useAuthStore } from '@/stores/auth.store'

export default function NewUserPage() {
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
          Only administrators can create new users.
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
        title="Create User"
        description="Add a new user account to your organization."
        actions={
          <Button variant="outline" size="sm" onClick={() => router.push('/users')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        }
      />

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm onCancel={() => router.push('/users')} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
