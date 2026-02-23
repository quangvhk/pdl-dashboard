'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { CheckCircle2, XCircle } from 'lucide-react'
import { DataTable, DataTableColumn } from '@/components/shared/data-table'
import { Pagination } from '@/components/shared/pagination'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUsers } from '@/features/users/hooks/use-users'
import { RoleBadge } from './role-badge'
import type { User } from '@/types'

// ─── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20

// ─── Column definitions ────────────────────────────────────────────────────────

const columns: DataTableColumn<User>[] = [
  {
    key: 'user',
    header: 'User',
    sortable: true,
    cell: (row) => {
      const initials = `${row.firstName[0] ?? ''}${row.lastName[0] ?? ''}`.toUpperCase()
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.avatar ?? undefined} alt={`${row.firstName} ${row.lastName}`} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <Link
              href={`/users/${row.id}`}
              className="font-medium hover:underline"
            >
              {row.firstName} {row.lastName}
            </Link>
            <p className="text-muted-foreground text-xs">{row.email}</p>
          </div>
        </div>
      )
    },
  },
  {
    key: 'tenants',
    header: 'Tenants',
    className: 'hidden sm:table-cell',
    cell: (row) => {
      if (row.isSuperAdmin) {
        return <RoleBadge role="SUPER_ADMIN" />
      }
      if (!row.tenants || row.tenants.length === 0) {
        return <span className="text-muted-foreground text-sm">No memberships</span>
      }
      return (
        <span className="text-sm">{row.tenants.length} tenant{row.tenants.length !== 1 ? 's' : ''}</span>
      )
    },
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    cell: (row) =>
      row.isActive ? (
        <span className="flex items-center gap-1.5 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          Active
        </span>
      ) : (
        <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <XCircle className="h-4 w-4" />
          Inactive
        </span>
      ),
  },
  {
    key: 'lastLoginAt',
    header: 'Last Login',
    sortable: true,
    className: 'hidden md:table-cell',
    cell: (row) =>
      row.lastLoginAt ? (
        <span className="text-muted-foreground text-sm">
          {format(new Date(row.lastLoginAt), 'MMM d, yyyy')}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">Never</span>
      ),
  },
  {
    key: 'createdAt',
    header: 'Joined',
    sortable: true,
    className: 'hidden lg:table-cell',
    cell: (row) => (
      <span className="text-muted-foreground text-sm">
        {format(new Date(row.createdAt), 'MMM d, yyyy')}
      </span>
    ),
  },
]

// ─── Component ─────────────────────────────────────────────────────────────────

export function UserTable() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data: users = [], isLoading, isError } = useUsers({
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  })

  // Pagination heuristic: if returned count < PAGE_SIZE, we're on the last page
  const isLastPage = users.length < PAGE_SIZE
  const totalPages = isLastPage ? page : page + 1

  return (
    <div className="space-y-4">

      {/* Error banner */}
      {isError && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load users. Please try again.
        </div>
      )}

      {/* Table */}
      <DataTable<User>
        columns={columns}
        data={users}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search by name or email…"
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        onRowClick={(row) => {
          window.location.href = `/users/${row.id}`
        }}
        emptyTitle="No users found"
        emptyDescription="No users match your current filters."
      />

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        pageSize={PAGE_SIZE}
        totalItems={isLastPage ? (page - 1) * PAGE_SIZE + users.length : undefined}
      />
    </div>
  )
}
