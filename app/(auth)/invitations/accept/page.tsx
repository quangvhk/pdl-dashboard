import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AcceptInvitationPage } from '@/features/invitations/components/accept-invitation-page'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Accept Invitation',
}

export default function AcceptInvitationRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AcceptInvitationPage />
    </Suspense>
  )
}
