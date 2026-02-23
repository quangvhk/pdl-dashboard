'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { MoreHorizontal, UserX, UserCheck, Trash2, Shield } from 'lucide-react'
import { DataTable, DataTableColumn } from '@/components/shared/data-table'
import { Pagination } from '@/components/shared/pagination'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { useMembers } from '../hooks/use-members'
import { useSuspendMember, useActivateMember } from '../hooks/use-suspend-member'
import { useRemoveMember } from '../hooks/use-remove-member'
import { ChangeRoleDialog } from './change-role-dialog'
import type { Member, MemberStatus } from '@/types'

// ─── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20

// ─── Actions Cell ──────────────────────────────────────────────────────────────

interface ActionsCellProps {
  member: Member
  onChangeRole: (member: Member) => void
}

function ActionsCell({ member, onChangeRole }: ActionsCellProps) {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const suspendMutation = useSuspendMember()
  const activateMutation = useActivateMember()
  const removeMutation = useRemoveMember()

  const isActive = member.status === 'ACTIVE'
  const isPending =
    suspendMutation.isPending || activateMutation.isPending || removeMutation.isPending

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onChangeRole(member)}>
            <Shield className="mr-2 h-4 w-4" />
            Change Role
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isActive ? (
            <DropdownMenuItem
              onClick={() => suspendMutation.mutate(member.id)}
              className="text-amber-600 focus:text-amber-600"
            >
              <UserX className="mr-2 h-4 w-4" />
              Suspend
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => activateMutation.mutate(member.id)}
              className="text-green-600 focus:text-green-600"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Activate
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setRemoveDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Remove confirmation dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              {member.user
                ? `${member.user.firstName} ${member.user.lastName} will be removed from this tenant. They will lose access to all tenant resources.`
                : 'This member will be removed from the tenant.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                removeMutation.mutate(member.id)
                setRemoveDialogOpen(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function MemberTable() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'ALL'>('ALL')
  const [changeRoleMember, setChangeRoleMember] = useState<Member | null>(null)

  const { data: members = [], isLoading, isError } = useMembers({
    search: search || undefined,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    page,
    limit: PAGE_SIZE,
  })

  const isLastPage = members.length < PAGE_SIZE
  const totalPages = isLastPage ? page : page + 1

  // ── Column definitions ──────────────────────────────────────────────────────

  const columns: DataTableColumn<Member>[] = [
    {
      key: 'user',
      header: 'Member',
      sortable: true,
      cell: (row) => {
        const name = row.user
          ? `${row.user.firstName} ${row.user.lastName}`
          : row.userId
        const initials = row.user
          ? `${row.user.firstName[0] ?? ''}${row.user.lastName[0] ?? ''}`.toUpperCase()
          : '?'
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{name}</p>
              {row.user && (
                <p className="text-muted-foreground text-xs">{row.user.email}</p>
              )}
            </div>
          </div>
        )
      },
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
      cell: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'default' : 'secondary'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      sortable: true,
      className: 'hidden md:table-cell',
      cell: (row) => (
        <span className="text-muted-foreground text-sm">
          {format(new Date(row.joinedAt), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (row) => (
        <ActionsCell
          member={row}
          onChangeRole={(m) => setChangeRoleMember(m)}
        />
      ),
    },
  ]

  // ── Toolbar ─────────────────────────────────────────────────────────────────

  const toolbar = (
    <Select
      value={statusFilter}
      onValueChange={(val) => {
        setStatusFilter(val as MemberStatus | 'ALL')
        setPage(1)
      }}
    >
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All statuses</SelectItem>
        <SelectItem value="ACTIVE">Active</SelectItem>
        <SelectItem value="SUSPENDED">Suspended</SelectItem>
      </SelectContent>
    </Select>
  )

  return (
    <div className="space-y-4">
      {/* Error banner */}
      {isError && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load members. Please try again.
        </div>
      )}

      {/* Table */}
      <DataTable<Member>
        columns={columns}
        data={members}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search by name or email…"
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        toolbar={toolbar}
        onRowClick={(row) => router.push(`/members/${row.id}`)}
        emptyTitle="No members found"
        emptyDescription="No members match your current filters."
      />

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        pageSize={PAGE_SIZE}
        totalItems={isLastPage ? (page - 1) * PAGE_SIZE + members.length : undefined}
      />

      {/* Change role dialog */}
      {changeRoleMember && (
        <ChangeRoleDialog
          member={changeRoleMember}
          open={!!changeRoleMember}
          onOpenChange={(open) => {
            if (!open) setChangeRoleMember(null)
          }}
        />
      )}
    </div>
  )
}
