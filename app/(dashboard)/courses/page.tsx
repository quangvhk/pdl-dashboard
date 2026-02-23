'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs'
import { Plus, Search } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useCourses } from '@/features/courses/hooks/use-courses'
import { CourseList } from '@/features/courses/components/course-list'
import { PageHeader } from '@/components/shared/page-header'
import { Pagination } from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CourseLevel, CourseStatus } from '@/types'

const PAGE_SIZE = 9

const LEVEL_OPTIONS: { value: CourseLevel | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Levels' },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
]

const STATUS_OPTIONS: { value: CourseStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
]

export default function CoursesPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin)
  const currentRole = useAuthStore((s) => s.currentRole)

  const isInstructor = currentRole === 'INSTRUCTOR'
  const isAdmin = isSuperAdmin || currentRole === 'TENANT_ADMIN'
  const isStudent = !isInstructor && !isAdmin
  const canCreate = isInstructor || isAdmin
  const showStatus = isInstructor || isAdmin

  // ── URL state via nuqs ──────────────────────────────────────────────────────
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''))
  const [level, setLevel] = useQueryState('level', parseAsString.withDefault('ALL'))
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault('ALL'))
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  // ── Build query params ──────────────────────────────────────────────────────
  const queryParams = {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    level: level !== 'ALL' ? level : undefined,
    // Students always see PUBLISHED only; others use the filter
    status: isStudent ? 'PUBLISHED' : status !== 'ALL' ? status : undefined,
  }

  const { data: courses, isLoading } = useCourses(queryParams)

  // ── Derived pagination ──────────────────────────────────────────────────────
  // API returns Course[] — derive total pages from array length heuristic
  // (real pagination metadata would come from PaginatedResponse; for now use
  //  length < PAGE_SIZE to detect last page)
  const courseList = courses ?? []
  const isLastPage = courseList.length < PAGE_SIZE
  const totalPages = isLastPage ? page : page + 1

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value || null)
      setPage(1)
    },
    [setSearch, setPage],
  )

  const handleLevelChange = useCallback(
    (value: string) => {
      setLevel(value === 'ALL' ? null : value)
      setPage(1)
    },
    [setLevel, setPage],
  )

  const handleStatusChange = useCallback(
    (value: string) => {
      setStatus(value === 'ALL' ? null : value)
      setPage(1)
    },
    [setStatus, setPage],
  )

  const handleClearFilters = useCallback(() => {
    setSearch(null)
    setLevel(null)
    setStatus(null)
    setPage(1)
  }, [setSearch, setLevel, setStatus, setPage])

  const hasActiveFilters = !!search || level !== 'ALL' || status !== 'ALL'

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="Courses"
        description={
          isStudent
            ? 'Browse available courses and start learning.'
            : 'Manage and browse all courses.'
        }
        actions={
          canCreate ? (
            <Button onClick={() => router.push('/courses/new')} size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              New Course
            </Button>
          ) : undefined
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>

        {/* Level filter */}
        <Select value={level} onValueChange={handleLevelChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            {LEVEL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter — hidden for students (they always see PUBLISHED) */}
        {!isStudent && (
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Course grid */}
      <CourseList
        courses={courseList}
        isLoading={isLoading}
        showStatus={showStatus}
        emptyTitle={hasActiveFilters ? 'No courses match your filters' : 'No courses yet'}
        emptyDescription={
          hasActiveFilters
            ? 'Try adjusting your search or filters.'
            : canCreate
              ? 'Create your first course to get started.'
              : 'Check back later for new courses.'
        }
        onEmptyAction={hasActiveFilters ? handleClearFilters : undefined}
        emptyActionLabel="Clear filters"
      />

      {/* Pagination */}
      {!isLoading && courseList.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          pageSize={PAGE_SIZE}
          totalItems={isLastPage ? (page - 1) * PAGE_SIZE + courseList.length : undefined}
        />
      )}
    </div>
  )
}
