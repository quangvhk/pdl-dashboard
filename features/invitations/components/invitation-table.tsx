'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { XCircle, Clock } from 'lucide-react'
import { DataTable, DataTableColumn } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { RoleBadge } from '@/features/users/components/role-badge'
import { useInvitations } from '../hooks/use-invitations'
import { useCancelInvitation } from '../hooks/use-cancel-invitation'
import type { Invitation, InvitationStatus } from '@/types'

// ─── Status Badge ──────────────────────────────────────────────────────────────

function InvitationStatusBadge({ status }: { status: InvitationStatus }) {
  const variants: Record<InvitationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    PENDING: 'default',
    ACCEPTED: 'secondary',
    EXPIRED: 'outline',
    CANCELLED: 'destructive',
  }
  return <Badge variant={variants[status]}>{status}</Badge>
}

// ─── Actions Cell ──────────────────────────────────────────────────────────────

interface ActionsCellProps {
  invitation: Invitation
}

function ActionsCell({ invitation }: ActionsCellProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const cancelMutation = useCancelInvitation()

  // Only PENDING invitations can be cancelled
  if (invitation.status !== 'PENDING') {
    return null
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setCancelDialogOpen(true)}
        disabled={cancelMutation.isPending}
      >
        <XCircle className="mr-1.5 h-4 w-4" />
        Cancel
      </Button>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              The invitation to <strong>{invitation.email}</strong> will be cancelled and can no
              longer be accepted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                cancelMutation.mutate(invitation.id)
                setCancelDialogOpen(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function InvitationTable() {
  const [search, setSearch] = useState('')
  const { data: allInvitations = [], isLoading, isError } = useInvitations()

  // Client-side filter by email
  const invitations = search
    ? allInvitations.filter((inv) =>
        inv.email.toLowerCase().includes(search.toLowerCase()),
      )
    : allInvitations

  // ── Column definitions ──────────────────────────────────────────────────────

  const columns: DataTableColumn<Invitation>[] = [
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      cell: (row) => (
        <span className="font-medium">{row.email}</span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      cell: (row) => <RoleBadge role={row.roleName} />,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => <InvitationStatusBadge status={row.status} />,
    },
    {
      key: 'invitedBy',
      header: 'Invited By',
      className: 'hidden md:table-cell',
      cell: (row) => (
        <span className="text-muted-foreground text-sm">{row.invitedBy}</span>
      ),
    },
    {
      key: 'expiresAt',
      header: 'Expires',
      sortable: true,
      className: 'hidden lg:table-cell',
      cell: (row) => {
        const isExpired = new Date(row.expiresAt) < new Date()
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <Clock className={`h-3.5 w-3.5 ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`} />
            <span className={isExpired ? 'text-destructive' : 'text-muted-foreground'}>
              {format(new Date(row.expiresAt), 'MMM d, yyyy')}
            </span>
          </div>
        )
      },
    },
    {
      key: 'actions',
      header: '',
      cell: (row) => <ActionsCell invitation={row} />,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Error banner */}
      {isError && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load invitations. Please try again.
        </div>
      )}

      {/* Table */}
      <DataTable<Invitation>
        columns={columns}
        data={invitations}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search by email…"
        searchValue={search}
        onSearchChange={setSearch}
        emptyTitle="No invitations found"
        emptyDescription="No invitations have been sent yet. Invite a member to get started."
      />
    </div>
  )
}
