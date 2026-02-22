'use client'

import { BookOpen } from 'lucide-react'
import { EnrollmentCard, EnrollmentCardSkeleton } from './enrollment-card'
import { EmptyState } from '@/components/shared/empty-state'
import type { Enrollment, EnrollmentStatus } from '@/types'

const GROUP_CONFIG: Record<
  EnrollmentStatus,
  { label: string; order: number }
> = {
  ACTIVE: { label: 'In Progress', order: 0 },
  COMPLETED: { label: 'Completed', order: 1 },
  DROPPED: { label: 'Dropped', order: 2 },
}

interface EnrollmentListProps {
  enrollments: Enrollment[] | undefined
  isLoading: boolean
  onBrowseCourses?: () => void
}

export function EnrollmentList({
  enrollments,
  isLoading,
  onBrowseCourses,
}: EnrollmentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Skeleton for "In Progress" group */}
        <section>
          <div className="mb-4 h-6 w-32 rounded bg-muted" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <EnrollmentCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    )
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No enrollments yet"
        description="You haven't enrolled in any courses. Browse the catalog to get started."
        action={
          onBrowseCourses
            ? { label: 'Browse Courses', onClick: onBrowseCourses }
            : undefined
        }
      />
    )
  }

  // Group enrollments by status
  const grouped = enrollments.reduce<Record<EnrollmentStatus, Enrollment[]>>(
    (acc, enrollment) => {
      const status = enrollment.status
      if (!acc[status]) acc[status] = []
      acc[status].push(enrollment)
      return acc
    },
    {} as Record<EnrollmentStatus, Enrollment[]>,
  )

  // Sort groups by defined order
  const sortedGroups = (Object.keys(grouped) as EnrollmentStatus[]).sort(
    (a, b) => (GROUP_CONFIG[a]?.order ?? 99) - (GROUP_CONFIG[b]?.order ?? 99),
  )

  return (
    <div className="space-y-10">
      {sortedGroups.map((status) => {
        const items = grouped[status]
        if (!items || items.length === 0) return null
        const config = GROUP_CONFIG[status]

        return (
          <section key={status}>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-lg font-semibold">{config.label}</h2>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-sm font-medium text-muted-foreground">
                {items.length}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((enrollment) => (
                <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
