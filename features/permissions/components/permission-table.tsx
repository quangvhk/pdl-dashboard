'use client'

import { useState } from 'react'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { DataTable, DataTableColumn } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { usePermissions } from '../hooks/use-permissions'
import { useDeletePermission } from '../hooks/use-delete-permission'
import type { Permission } from '@/types'

// ─── Actions Cell ──────────────────────────────────────────────────────────────

interface ActionsCellProps {
  permission: Permission
}

function ActionsCell({ permission }: ActionsCellProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const deleteMutation = useDeletePermission()

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
            <AlertDialogTitle>Delete permission?</AlertDialogTitle>
            <AlertDialogDescription>
              The permission{' '}
              <strong>
                {permission.action}:{permission.subject}
              </strong>{' '}
              will be permanently deleted. Any role assignments using this permission will also be
              removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteMutation.mutate(permission.id)
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

export function PermissionTable() {
  const [search, setSearch] = useState('')

  const { data: permissions = [], isLoading, isError } = usePermissions()

  // Client-side search filter
  const filtered = search
    ? permissions.filter(
        (p) =>
          p.action.toLowerCase().includes(search.toLowerCase()) ||
          p.subject.toLowerCase().includes(search.toLowerCase()) ||
          (p.reason ?? '').toLowerCase().includes(search.toLowerCase()),
      )
    : permissions

  // ── Column definitions ──────────────────────────────────────────────────────

  const columns: DataTableColumn<Permission>[] = [
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-sm font-medium">{row.action}</span>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-sm">{row.subject}</span>
      ),
    },
    {
      key: 'inverted',
      header: 'Type',
      className: 'hidden sm:table-cell',
      cell: (row) =>
        row.inverted ? (
          <Badge variant="destructive" className="text-xs">
            Deny
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">
            Allow
          </Badge>
        ),
    },
    {
      key: 'conditions',
      header: 'Conditions',
      className: 'hidden lg:table-cell',
      cell: (row) =>
        row.conditions ? (
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            {JSON.stringify(row.conditions)}
          </code>
        ) : (
          <span className="text-muted-foreground/50 text-sm italic">None</span>
        ),
    },
    {
      key: 'reason',
      header: 'Reason',
      className: 'hidden md:table-cell',
      cell: (row) =>
        row.reason ? (
          <span className="text-muted-foreground text-sm">{row.reason}</span>
        ) : (
          <span className="text-muted-foreground/50 text-sm italic">—</span>
        ),
    },
    {
      key: 'actions',
      header: '',
      cell: (row) => <ActionsCell permission={row} />,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Error banner */}
      {isError && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load permissions. Please try again.
        </div>
      )}

      {/* Table */}
      <DataTable<Permission>
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search permissions…"
        searchValue={search}
        onSearchChange={setSearch}
        emptyTitle="No permissions found"
        emptyDescription="No permissions match your search. Create a new permission to get started."
      />
    </div>
  )
}
