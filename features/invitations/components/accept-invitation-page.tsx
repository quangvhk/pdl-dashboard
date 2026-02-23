'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useAcceptInvitation } from '../hooks/use-accept-invitation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// ─── Component ─────────────────────────────────────────────────────────────────

export function AcceptInvitationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const acceptMutation = useAcceptInvitation()

  // Auto-accept when token is present in URL
  useEffect(() => {
    if (token && !acceptMutation.isPending && !acceptMutation.isSuccess && !acceptMutation.isError) {
      acceptMutation.mutate({ token })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // ── No token ──────────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Invalid Invitation Link
          </CardTitle>
          <CardDescription>
            This invitation link is missing a token. Please check the link in your email and try
            again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => router.push('/login')}>
            Go to Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  // ── Pending ───────────────────────────────────────────────────────────────────
  if (acceptMutation.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Accepting Invitation…
          </CardTitle>
          <CardDescription>
            Please wait while we process your invitation.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // ── Success ───────────────────────────────────────────────────────────────────
  if (acceptMutation.isSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            Invitation Accepted!
          </CardTitle>
          <CardDescription>
            You have successfully joined the tenant. You can now sign in to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push('/login')}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (acceptMutation.isError) {
    const errorMessage =
      acceptMutation.error instanceof Error
        ? acceptMutation.error.message
        : 'The invitation may be expired, already accepted, or cancelled.'

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Failed to Accept Invitation
          </CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => acceptMutation.mutate({ token })}
            disabled={acceptMutation.isPending}
          >
            Try Again
          </Button>
          <Button variant="ghost" onClick={() => router.push('/login')}>
            Go to Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}
