import { Skeleton } from '@/components/ui/skeleton'
import { TableSkeleton } from '@/components/shared/loading-skeleton'

export default function RolePermissionsLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>

      {/* Search + action toolbar */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-full max-w-xs" />
        <Skeleton className="h-9 w-40" />
      </div>

      {/* Table */}
      <TableSkeleton rows={8} columns={4} />
    </div>
  )
}
