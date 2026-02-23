'use client'

import { Lock, Building2 } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth.store'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { TenantTable } from '@/features/tenants/components/tenant-table'

export default function TenantsPage() {
  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin ?? false)

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
        title="Tenants"
        description="Manage all tenants on the platform."
        actions={
          <Button asChild>
            <Link href="/tenants/new">
              <Building2 className="mr-2 h-4 w-4" />
              New Tenant
            </Link>
          </Button>
        }
      />

      <TenantTable />
    </div>
  )
}
