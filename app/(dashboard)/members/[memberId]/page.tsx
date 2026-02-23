'use client'

import { use } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { MemberDetail } from '@/features/members/components/member-detail'
import { PageHeader } from '@/components/shared/page-header'
import { RoleGate } from '@/components/shared/role-gate'
import { Button } from '@/components/ui/button'

interface MemberDetailPageProps {
  params: Promise<{ memberId: string }>
}

export default function MemberDetailPage({ params }: MemberDetailPageProps) {
  const { memberId } = use(params)

  return (
    <RoleGate allowedRoles={['TENANT_ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <PageHeader
          title="Member Detail"
          description="View and manage this tenant member."
          actions={
            <Button variant="outline" size="sm" asChild>
              <Link href="/members">
                <ChevronLeft className="mr-1.5 h-4 w-4" />
                Back to Members
              </Link>
            </Button>
          }
        />
        <MemberDetail memberId={memberId} />
      </div>
    </RoleGate>
  )
}
