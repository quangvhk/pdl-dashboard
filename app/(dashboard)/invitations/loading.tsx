import { Skeleton } from '@/components/ui/skeleton'
import { TableSkeleton } from '@/components/shared/loading-skeleton'

export default function InvitationsLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Toolbar: search */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-full max-w-xs" />
      </div>

      {/* Table */}
      <TableSkeleton rows={8} columns={6} />
    </div>
  )
}
