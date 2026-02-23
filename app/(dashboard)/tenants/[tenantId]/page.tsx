'use client'

import { use } from 'react'
import { Lock } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth.store'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { TenantDetail } from '@/features/tenants/components/tenant-detail'

interface TenantDetailPageProps {
  params: Promise<{ tenantId: string }>
}

export default function TenantDetailPage({ params }: TenantDetailPageProps) {
  const { tenantId } = use(params)
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
        title="Tenant Detail"
        description="View and manage tenant settings and status."
        actions={
          <Button variant="outline" asChild>
            <Link href="/tenants">Back to Tenants</Link>
          </Button>
        }
      />

      <TenantDetail tenantId={tenantId} />
    </div>
  )
}
