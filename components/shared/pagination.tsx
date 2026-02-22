'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

interface PaginationProps {
  /** Current page (1-based) */
  page: number
  /** Total number of pages */
  totalPages: number
  /** Callback when the page changes */
  onPageChange: (page: number) => void
  /** Total number of items (optional, for display) */
  totalItems?: number
  /** Items per page (optional, for display) */
  pageSize?: number
  /** Optional class for the wrapper */
  className?: string
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const canPrev = page > 1
  const canNext = page < totalPages

  // Build visible page numbers: always show first, last, current ±1, with ellipsis
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis')[] = [1]

    if (page > 3) pages.push('ellipsis')

    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (page < totalPages - 2) pages.push('ellipsis')

    pages.push(totalPages)

    return pages
  }

  const pageNumbers = getPageNumbers()

  // Range display: "Showing 1–20 of 87"
  const rangeStart = totalItems !== undefined && pageSize ? (page - 1) * pageSize + 1 : null
  const rangeEnd =
    totalItems !== undefined && pageSize
      ? Math.min(page * pageSize, totalItems)
      : null

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 sm:flex-row sm:justify-between',
        className,
      )}
    >
      {/* Range label */}
      {totalItems !== undefined && rangeStart !== null && rangeEnd !== null ? (
        <p className="text-muted-foreground text-sm">
          Showing{' '}
          <span className="font-medium text-foreground">{rangeStart}</span>–
          <span className="font-medium text-foreground">{rangeEnd}</span> of{' '}
          <span className="font-medium text-foreground">{totalItems}</span>
        </p>
      ) : (
        <p className="text-muted-foreground text-sm">
          Page{' '}
          <span className="font-medium text-foreground">{page}</span> of{' '}
          <span className="font-medium text-foreground">{totalPages}</span>
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* First */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={!canPrev}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        {pageNumbers.map((p, idx) =>
          p === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              className="text-muted-foreground flex h-8 w-8 items-center justify-center text-sm"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8 text-sm"
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </Button>
          ),
        )}

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={!canNext}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
