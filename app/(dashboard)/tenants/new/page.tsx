'use client'

import { Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TenantForm } from '@/features/tenants/components/tenant-form'

export default function NewTenantPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const roles = user?.roles ?? []
  const isSuperAdmin = roles.includes('SUPER_ADMIN')

  // ── Role gate ─────────────────────────────────────────────────────────────────
  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <Lock className="text-muted-foreground h-12 w-12" />
        <h2 className="text-xl font-semibold">Access Restricted</h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          Tenant management is only available to Super Admins.
        </p>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Tenant"
        description="Create a new tenant on the platform."
        actions={
          <Button variant="outline" asChild>
            <Link href="/tenants">Back to Tenants</Link>
          </Button>
        }
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Tenant Details</CardTitle>
          <CardDescription>
            Fill in the details below to create a new tenant. The slug cannot be changed after
            creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TenantForm onCancel={() => router.push('/tenants')} />
        </CardContent>
      </Card>
    </div>
  )
}
