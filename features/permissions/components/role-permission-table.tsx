'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
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
import { useRolePermissions } from '../hooks/use-role-permissions'
import { useRemoveRolePermission } from '../hooks/use-remove-role-permission'
import { AssignPermissionDialog } from './assign-permission-dialog'
import type { RolePermission } from '@/types'

// ─── Remove Cell ───────────────────────────────────────────────────────────────

interface RemoveCellProps {
  rolePermission: RolePermission
}

function RemoveCell({ rolePermission }: RemoveCellProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const removeMutation = useRemoveRolePermission()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        disabled={removeMutation.isPending}
        onClick={() => setDialogOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Remove assignment</span>
      </Button>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove permission assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              The permission{' '}
              <strong>
                {rolePermission.action}:{rolePermission.subject}
              </strong>{' '}
              will be removed from role <strong>{rolePermission.roleName}</strong>. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                removeMutation.mutate(rolePermission.id)
                setDialogOpen(false)
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

interface RolePermissionTableProps {
  /** Filter by a specific role ID. When omitted, shows all assignments. */
  roleId?: string
}

export function RolePermissionTable({ roleId }: RolePermissionTableProps) {
  const [search, setSearch] = useState('')
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)

  const {
    data: rolePermissions = [],
    isLoading,
    isError,
  } = useRolePermissions(roleId ? { roleId } : undefined)

  // Client-side search filter
  const filtered = search
    ? rolePermissions.filter(
        (rp) =>
          rp.roleName.toLowerCase().includes(search.toLowerCase()) ||
          rp.action.toLowerCase().includes(search.toLowerCase()) ||
          rp.subject.toLowerCase().includes(search.toLowerCase()),
      )
    : rolePermissions

  // ── Column definitions ──────────────────────────────────────────────────────

  const columns: DataTableColumn<RolePermission>[] = [
    {
      key: 'roleName',
      header: 'Role',
      sortable: true,
      cell: (row) => (
        <Badge variant="outline" className="font-mono text-xs">
          {row.roleName}
        </Badge>
      ),
    },
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
      key: 'actions',
      header: '',
      cell: (row) => <RemoveCell rolePermission={row} />,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Error banner */}
      {isError && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load role-permission assignments. Please try again.
        </div>
      )}

      {/* Table */}
      <DataTable<RolePermission>
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search by role, action, or subject…"
        searchValue={search}
        onSearchChange={setSearch}
        toolbar={
          <Button size="sm" onClick={() => setAssignDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Assign Permission
          </Button>
        }
        emptyTitle="No assignments found"
        emptyDescription="No role-permission assignments exist yet. Click 'Assign Permission' to add one."
      />

      {/* Assign permission dialog */}
      <AssignPermissionDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        defaultRoleId={roleId}
      />
    </div>
  )
}
