import { Skeleton } from '@/components/ui/skeleton'
import { TableSkeleton } from '@/components/shared/loading-skeleton'

export default function TenantsLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Search */}
      <Skeleton className="h-10 w-full max-w-sm" />

      {/* Table */}
      <TableSkeleton rows={10} columns={5} />
    </div>
  )
}
