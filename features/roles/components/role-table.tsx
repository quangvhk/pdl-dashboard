'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { MoreHorizontal, Pencil, Trash2, Lock } from 'lucide-react'
import { DataTable, DataTableColumn } from '@/components/shared/data-table'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useRoles } from '../hooks/use-roles'
import { useDeleteRole } from '../hooks/use-delete-role'
import type { PlatformRole } from '@/types'

// ─── Actions Cell ──────────────────────────────────────────────────────────────

interface ActionsCellProps {
  role: PlatformRole
}

function ActionsCell({ role }: ActionsCellProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const deleteMutation = useDeleteRole()

  // System roles cannot be edited or deleted
  if (role.isSystem) {
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Lock className="h-3.5 w-3.5" />
        <span className="text-xs">System</span>
      </div>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={deleteMutation.isPending}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/roles/${role.id}`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role?</AlertDialogTitle>
            <AlertDialogDescription>
              The role <strong>{role.name}</strong> will be permanently deleted. Members
              currently assigned this role may lose access. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteMutation.mutate(role.id)
                setDeleteDialogOpen(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function RoleTable() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const { data: roles = [], isLoading, isError } = useRoles()

  // Client-side search filter
  const filtered = search
    ? roles.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          (r.description ?? '').toLowerCase().includes(search.toLowerCase()),
      )
    : roles

  // ── Column definitions ──────────────────────────────────────────────────────

  const columns: DataTableColumn<PlatformRole>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium">{row.name}</span>
          {row.isSystem && (
            <Badge variant="secondary" className="text-xs">
              System
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      className: 'hidden md:table-cell',
      cell: (row) =>
        row.description ? (
          <span className="text-muted-foreground text-sm">{row.description}</span>
        ) : (
          <span className="text-muted-foreground/50 text-sm italic">No description</span>
        ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      className: 'hidden lg:table-cell',
      cell: (row) => (
        <span className="text-muted-foreground text-sm">
          {format(new Date(row.createdAt), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (row) => <ActionsCell role={row} />,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Error banner */}
      {isError && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load roles. Please try again.
        </div>
      )}

      {/* Table */}
      <DataTable<PlatformRole>
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search roles…"
        searchValue={search}
        onSearchChange={setSearch}
        onRowClick={(row) => {
          if (!row.isSystem) router.push(`/roles/${row.id}`)
        }}
        emptyTitle="No roles found"
        emptyDescription="No roles match your search. Create a new custom role to get started."
      />
    </div>
  )
}
