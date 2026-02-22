import { Skeleton } from '@/components/ui/skeleton'
import { TableSkeleton } from '@/components/shared/loading-skeleton'

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Toolbar: search + role filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-full sm:w-40" />
      </div>

      {/* Table */}
      <TableSkeleton rows={10} columns={5} />
    </div>
  )
}
