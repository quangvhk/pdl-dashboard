'use client'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// ─── Card Grid Skeleton ────────────────────────────────────────────────────────

interface CardGridSkeletonProps {
  count?: number
  className?: string
}

export function CardGridSkeleton({ count = 6, className }: CardGridSkeletonProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-40 w-full rounded-none" />
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="mt-3 h-8 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ─── Table Rows Skeleton ───────────────────────────────────────────────────────

interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <div className={cn('w-full space-y-0 overflow-hidden rounded-md border', className)}>
      {/* Header */}
      <div className="bg-muted/50 flex gap-4 border-b px-4 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex gap-4 border-b px-4 py-3 last:border-0"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className={cn('h-4 flex-1', colIdx === 0 && 'max-w-[120px]')}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Stat Cards Skeleton ───────────────────────────────────────────────────────

interface StatCardSkeletonProps {
  count?: number
  className?: string
}

export function StatCardSkeleton({ count = 4, className }: StatCardSkeletonProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-5 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-1 h-3 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ─── Page Skeleton ─────────────────────────────────────────────────────────────

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      {/* Content */}
      <CardGridSkeleton count={6} />
    </div>
  )
}

// ─── Detail Page Skeleton ──────────────────────────────────────────────────────

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}
