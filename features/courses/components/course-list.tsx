'use client'

import { BookOpen } from 'lucide-react'
import { CourseCard } from './course-card'
import { CardGridSkeleton } from '@/components/shared/loading-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import type { Course } from '@/types'

interface CourseListProps {
  courses: Course[]
  isLoading?: boolean
  /** Show status badge on each card (instructors/admins) */
  showStatus?: boolean
  /** Empty state message override */
  emptyTitle?: string
  emptyDescription?: string
  /** CTA shown in empty state */
  onEmptyAction?: () => void
  emptyActionLabel?: string
}

export function CourseList({
  courses,
  isLoading = false,
  showStatus = false,
  emptyTitle = 'No courses found',
  emptyDescription = 'Try adjusting your search or filters.',
  onEmptyAction,
  emptyActionLabel = 'Clear filters',
}: CourseListProps) {
  if (isLoading) {
    return <CardGridSkeleton count={6} />
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title={emptyTitle}
        description={emptyDescription}
        action={
          onEmptyAction
            ? { label: emptyActionLabel, onClick: onEmptyAction }
            : undefined
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} showStatus={showStatus} />
      ))}
    </div>
  )
}
