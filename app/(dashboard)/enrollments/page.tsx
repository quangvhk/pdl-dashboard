'use client'

import { useRouter } from 'next/navigation'
import { GraduationCap } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EnrollmentList } from '@/features/enrollments/components/enrollment-list'
import { useMyEnrollments } from '@/features/enrollments/hooks/use-enrollments'

export default function EnrollmentsPage() {
  const router = useRouter()
  const { data: enrollments, isLoading, isError } = useMyEnrollments()

  const active = enrollments?.filter((e) => e.status === 'ACTIVE').length ?? 0
  const completed = enrollments?.filter((e) => e.status === 'COMPLETED').length ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Enrollments"
        description={
          isLoading
            ? 'Loading your courses…'
            : enrollments && enrollments.length > 0
              ? `${active} in progress · ${completed} completed`
              : 'Track your learning progress'
        }
        actions={
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {isLoading ? '—' : (enrollments?.length ?? 0)} total
            </span>
          </div>
        }
      />

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load enrollments. Please refresh the page.
        </div>
      ) : (
        <EnrollmentList
          enrollments={enrollments}
          isLoading={isLoading}
          onBrowseCourses={() => router.push('/courses')}
        />
      )}
    </div>
  )
}
