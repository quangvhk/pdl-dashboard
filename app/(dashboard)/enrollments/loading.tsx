import { Skeleton } from '@/components/ui/skeleton'
import { CardGridSkeleton } from '@/components/shared/loading-skeleton'

export default function EnrollmentsLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* In Progress section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-6 rounded-full" />
        </div>
        <CardGridSkeleton count={3} />
      </div>

      {/* Completed section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-6 rounded-full" />
        </div>
        <CardGridSkeleton count={3} />
      </div>
    </div>
  )
}
