'use client'

import { ReactNode, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react'
import { TableSkeleton } from '@/components/shared/loading-skeleton'
import { EmptyState } from '@/components/shared/empty-state'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DataTableColumn<TRow> {
  /** Unique key for the column */
  key: string
  /** Column header label */
  header: string
  /** Render function for the cell value */
  cell: (row: TRow) => ReactNode
  /** Whether this column is sortable */
  sortable?: boolean
  /** Optional class for the <th> / <td> */
  className?: string
}

type SortDirection = 'asc' | 'desc' | null

interface SortState {
  key: string
  direction: SortDirection
}

interface DataTableProps<TRow> {
  /** Column definitions */
  columns: DataTableColumn<TRow>[]
  /** Row data */
  data: TRow[]
  /** Key extractor for rows (used as React key) */
  rowKey: (row: TRow) => string
  /** Show loading skeleton */
  isLoading?: boolean
  /** Empty state title */
  emptyTitle?: string
  /** Empty state description */
  emptyDescription?: string
  /** Show built-in search input */
  searchable?: boolean
  /** Placeholder for the search input */
  searchPlaceholder?: string
  /** Controlled search value */
  searchValue?: string
  /** Callback when search value changes */
  onSearchChange?: (value: string) => void
  /** Optional extra content rendered to the right of the search bar */
  toolbar?: ReactNode
  /** Optional class for the wrapper div */
  className?: string
  /** Callback when a row is clicked */
  onRowClick?: (row: TRow) => void
}

// ─── Sort Icon ─────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === 'asc') return <ChevronUp className="ml-1 inline h-3.5 w-3.5" />
  if (direction === 'desc') return <ChevronDown className="ml-1 inline h-3.5 w-3.5" />
  return <ChevronsUpDown className="ml-1 inline h-3.5 w-3.5 opacity-40" />
}

// ─── DataTable ─────────────────────────────────────────────────────────────────

export function DataTable<TRow>({
  columns,
  data,
  rowKey,
  isLoading = false,
  emptyTitle = 'No results',
  emptyDescription,
  searchable = false,
  searchPlaceholder = 'Search…',
  searchValue,
  onSearchChange,
  toolbar,
  className,
  onRowClick,
}: DataTableProps<TRow>) {
  // Internal sort state (client-side sort when no external handler)
  const [sort, setSort] = useState<SortState>({ key: '', direction: null })

  // Internal search state (used when searchValue is not controlled externally)
  const [internalSearch, setInternalSearch] = useState('')
  const effectiveSearch = searchValue !== undefined ? searchValue : internalSearch

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value)
    } else {
      setInternalSearch(value)
    }
  }

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return { key: '', direction: null }
    })
  }

  // Client-side filtering (only when search is not externally controlled)
  let rows = data
  if (searchable && searchValue === undefined && effectiveSearch) {
    const q = effectiveSearch.toLowerCase()
    rows = data.filter((row) =>
      columns.some((col) => {
        const cell = col.cell(row)
        if (typeof cell === 'string') return cell.toLowerCase().includes(q)
        return false
      }),
    )
  }

  // Client-side sort
  if (sort.key && sort.direction) {
    const col = columns.find((c) => c.key === sort.key)
    if (col) {
      rows = [...rows].sort((a, b) => {
        const av = col.cell(a)
        const bv = col.cell(b)
        const as = typeof av === 'string' ? av : String(av ?? '')
        const bs = typeof bv === 'string' ? bv : String(bv ?? '')
        return sort.direction === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as)
      })
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Toolbar */}
      {(searchable || toolbar) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {searchable && (
            <div className="relative w-full flex-1 sm:max-w-xs">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder={searchPlaceholder}
                value={effectiveSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={5} columns={columns.length} />
      ) : rows.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key} className={col.className}>
                    {col.sortable ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 font-medium"
                        onClick={() => handleSort(col.key)}
                      >
                        {col.header}
                        <SortIcon
                          direction={sort.key === col.key ? sort.direction : null}
                        />
                      </Button>
                    ) : (
                      col.header
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(onRowClick && 'cursor-pointer hover:bg-muted/50')}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
