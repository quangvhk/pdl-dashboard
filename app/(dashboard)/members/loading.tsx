import { Skeleton } from '@/components/ui/skeleton'
import { TableSkeleton } from '@/components/shared/loading-skeleton'

export default function MembersLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Toolbar: search + status filter */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-full max-w-xs" />
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Table */}
      <TableSkeleton rows={10} columns={5} />
    </div>
  )
}
