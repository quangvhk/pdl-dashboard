'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, GraduationCap, Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { PageHeader } from '@/components/shared/page-header'
import { DataTable, DataTableColumn } from '@/components/shared/data-table'
import { Pagination } from '@/components/shared/pagination'
import { useCourse } from '@/features/courses/hooks/use-course'
import { useCourseEnrollments } from '@/features/enrollments/hooks/use-course-enrollments'
import { useAuthStore } from '@/stores/auth.store'
import type { Enrollment, EnrollmentStatus } from '@/types'
import { format } from 'date-fns'

// ─── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20

const STATUS_VARIANT: Record<
  EnrollmentStatus,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  ACTIVE: 'default',
  COMPLETED: 'secondary',
  DROPPED: 'destructive',
}

const STATUS_LABEL: Record<EnrollmentStatus, string> = {
  ACTIVE: 'In Progress',
  COMPLETED: 'Completed',
  DROPPED: 'Dropped',
}

// ─── Column definitions ────────────────────────────────────────────────────────

const columns: DataTableColumn<Enrollment>[] = [
  {
    key: 'student',
    header: 'Student',
    sortable: true,
    cell: (row) => {
      const user = row.user
      if (!user) return <span className="text-muted-foreground">—</span>
      return (
        <div>
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-muted-foreground text-xs">{user.email}</p>
        </div>
      )
    },
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    cell: (row) => (
      <Badge variant={STATUS_VARIANT[row.status]}>{STATUS_LABEL[row.status]}</Badge>
    ),
  },
  {
    key: 'progress',
    header: 'Progress',
    className: 'hidden sm:table-cell',
    cell: (row) => (
      <div className="flex min-w-[120px] items-center gap-2">
        <Progress value={row.progressPercent} className="h-2 flex-1" />
        <span className="text-muted-foreground w-10 text-right text-xs">
          {row.progressPercent}%
        </span>
      </div>
    ),
  },
  {
    key: 'enrolledAt',
    header: 'Enrolled',
    sortable: true,
    className: 'hidden md:table-cell',
    cell: (row) => (
      <span className="text-muted-foreground text-sm">
        {format(new Date(row.enrolledAt), 'MMM d, yyyy')}
      </span>
    ),
  },
  {
    key: 'completedAt',
    header: 'Completed',
    sortable: true,
    className: 'hidden lg:table-cell',
    cell: (row) =>
      row.completedAt ? (
        <span className="text-muted-foreground text-sm">
          {format(new Date(row.completedAt), 'MMM d, yyyy')}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      ),
  },
]

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CourseEnrollmentsPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = use(params)
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // Role gate — only Instructor, Admin, SuperAdmin
  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin ?? false)
  const currentRole = useAuthStore((s) => s.currentRole)
  const canView =
    isSuperAdmin ||
    currentRole === 'INSTRUCTOR' ||
    currentRole === 'TENANT_ADMIN'

  const { data: course, isLoading: courseLoading } = useCourse(courseId)
  const {
    data: enrollments = [],
    isLoading: enrollmentsLoading,
    isError,
  } = useCourseEnrollments(courseId, {
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  })

  // ── Access denied ────────────────────────────────────────────────────────────
  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="bg-muted rounded-full p-4">
          <Lock className="text-muted-foreground h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold">Access Restricted</h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          Only instructors and administrators can view course enrollments.
        </p>
        <Button variant="outline" onClick={() => router.push('/courses')}>
          Back to Courses
        </Button>
      </div>
    )
  }

  // ── Derived stats ────────────────────────────────────────────────────────────
  const totalEnrollments = enrollments.length
  const activeCount = enrollments.filter((e) => e.status === 'ACTIVE').length
  const completedCount = enrollments.filter((e) => e.status === 'COMPLETED').length
  const avgProgress =
    totalEnrollments > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / totalEnrollments,
        )
      : 0

  // Pagination heuristic: if returned count < PAGE_SIZE, we're on the last page
  const isLastPage = enrollments.length < PAGE_SIZE
  const totalPages = isLastPage ? page : page + 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={courseLoading ? 'Loading…' : `${course?.title ?? 'Course'} — Enrollments`}
        description={
          courseLoading
            ? undefined
            : `Manage and track student progress for this course`
        }
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={`/courses/${courseId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Link>
          </Button>
        }
      />

      {/* Error banner */}
      {isError && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load enrollments. Please try again.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-md p-1.5">
              <Users className="text-primary h-4 w-4" />
            </div>
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Total
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">{totalEnrollments}</p>
          <p className="text-muted-foreground text-xs">enrolled students</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-blue-500/10 p-1.5">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Active
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">{activeCount}</p>
          <p className="text-muted-foreground text-xs">in progress</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-green-500/10 p-1.5">
              <GraduationCap className="h-4 w-4 text-green-500" />
            </div>
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Completed
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">{completedCount}</p>
          <p className="text-muted-foreground text-xs">finished course</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-orange-500/10 p-1.5">
              <GraduationCap className="h-4 w-4 text-orange-500" />
            </div>
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Avg Progress
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">{avgProgress}%</p>
          <p className="text-muted-foreground text-xs">across all students</p>
        </div>
      </div>

      {/* Enrollments table */}
      <DataTable<Enrollment>
        columns={columns}
        data={enrollments}
        rowKey={(row) => row.id}
        isLoading={enrollmentsLoading}
        searchable
        searchPlaceholder="Search by name or email…"
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        emptyTitle="No enrollments yet"
        emptyDescription="Students who enroll in this course will appear here."
      />

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        pageSize={PAGE_SIZE}
        totalItems={isLastPage ? (page - 1) * PAGE_SIZE + enrollments.length : undefined}
      />
    </div>
  )
}
