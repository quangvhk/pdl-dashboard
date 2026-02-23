import { Skeleton } from '@/components/ui/skeleton'
import { TableSkeleton } from '@/components/shared/loading-skeleton'

export default function PermissionsLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Search toolbar */}
      <Skeleton className="h-10 w-full max-w-xs" />

      {/* Table */}
      <TableSkeleton rows={8} columns={6} />
    </div>
  )
}
