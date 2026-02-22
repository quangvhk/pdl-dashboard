'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Building2 } from 'lucide-react'
import { DataTable, DataTableColumn } from '@/components/shared/data-table'
import { Pagination } from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'
import { useTenants } from '@/features/tenants/hooks/use-tenants'
import type { Tenant, TenantStatus } from '@/types'

// ─── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20

const STATUS_VARIANT: Record<TenantStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ACTIVE: 'default',
  TRIAL: 'secondary',
  SUSPENDED: 'destructive',
}

const STATUS_LABEL: Record<TenantStatus, string> = {
  ACTIVE: 'Active',
  TRIAL: 'Trial',
  SUSPENDED: 'Suspended',
}

// ─── Column definitions ────────────────────────────────────────────────────────

const columns: DataTableColumn<Tenant>[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    cell: (row) => (
      <div className="flex items-center gap-2">
        <Building2 className="text-muted-foreground h-4 w-4 shrink-0" />
        <span className="font-medium">{row.name}</span>
      </div>
    ),
  },
  {
    key: 'slug',
    header: 'Slug',
    sortable: true,
    cell: (row) => (
      <code className="bg-muted rounded px-1.5 py-0.5 text-xs">{row.slug}</code>
    ),
  },
  {
    key: 'domain',
    header: 'Domain',
    cell: (row) =>
      row.domain ? (
        <span className="text-muted-foreground text-sm">{row.domain}</span>
      ) : (
        <span className="text-muted-foreground text-sm italic">—</span>
      ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    cell: (row) => (
      <Badge variant={STATUS_VARIANT[row.status]}>{STATUS_LABEL[row.status]}</Badge>
    ),
  },
  {
    key: 'createdAt',
    header: 'Created',
    sortable: true,
    cell: (row) => (
      <span className="text-muted-foreground text-sm">
        {format(new Date(row.createdAt), 'MMM d, yyyy')}
      </span>
    ),
  },
]

// ─── Component ─────────────────────────────────────────────────────────────────

export function TenantTable() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data: tenants = [], isLoading, isError } = useTenants({
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  })

  // Pagination heuristic: if returned count < PAGE_SIZE, we're on the last page
  const isLastPage = tenants.length < PAGE_SIZE
  const totalPages = isLastPage ? page : page + 1

  return (
    <div className="space-y-4">
      {/* Error banner */}
      {isError && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load tenants. Please try again.
        </div>
      )}

      {/* Table */}
      <DataTable<Tenant>
        columns={columns}
        data={tenants}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search by name or slug…"
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        onRowClick={(row) => {
          window.location.href = `/tenants/${row.id}`
        }}
        emptyTitle="No tenants found"
        emptyDescription="No tenants match your current search."
      />

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        pageSize={PAGE_SIZE}
        totalItems={isLastPage ? (page - 1) * PAGE_SIZE + tenants.length : undefined}
      />
    </div>
  )
}
