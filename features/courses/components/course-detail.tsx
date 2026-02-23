'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  ClipboardList,
  Edit,
  BarChart2,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { EnrollButton } from '@/features/enrollments/components/enroll-button'
import { useCourse } from '@/features/courses/hooks/use-course'
import { useSections } from '@/features/courses/hooks/use-sections'
import { useMyEnrollments } from '@/features/enrollments/hooks/use-enrollments'
import { useAuthStore } from '@/stores/auth.store'
import type { Section } from '@/types'

// ── Constants ────────────────────────────────────────────────────────────────

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
}

const LEVEL_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  BEGINNER: 'secondary',
  INTERMEDIATE: 'default',
  ADVANCED: 'destructive',
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PUBLISHED: 'default',
  DRAFT: 'outline',
  ARCHIVED: 'secondary',
}

// ── Section accordion item ───────────────────────────────────────────────────

interface SectionItemProps {
  section: Section
  courseId: string
  /** Lesson IDs the student has completed */
  completedLessonIds: Set<string>
  isEnrolled: boolean
  defaultOpen?: boolean
}

function SectionItem({
  section,
  courseId,
  completedLessonIds,
  isEnrolled,
  defaultOpen = false,
}: SectionItemProps) {
  const [open, setOpen] = useState(defaultOpen)

  // We don't fetch lessons here — lesson list is fetched lazily per section
  // For the detail view we show lesson count from section metadata and link to lesson viewer
  const lessonCount = section.lessonsCount ?? 0

  return (
    <div className="border-b last:border-b-0">
      {/* Section header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="font-medium text-sm">{section.title}</span>
        </div>
        <span className="text-xs text-muted-foreground shrink-0 ml-2">
          {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
        </span>
      </button>

      {/* Section description + lesson placeholders when open */}
      {open && (
        <div className="pb-2">
          {section.description && (
            <p className="px-10 pb-2 text-xs text-muted-foreground">{section.description}</p>
          )}

          {lessonCount === 0 ? (
            <p className="px-10 py-2 text-xs text-muted-foreground italic">
              No lessons yet.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {/* Render placeholder lesson rows — actual lesson list is loaded in lesson viewer */}
              {Array.from({ length: lessonCount }).map((_, idx) => {
                // We don't have individual lesson IDs here without fetching lessons,
                // so we render a "Go to section" link that opens the first lesson
                const isFirst = idx === 0
                return (
                  <li key={idx}>
                    {isEnrolled && isFirst ? (
                      <Link
                        href={`/courses/${courseId}/sections/${section.id}/lessons`}
                        className="flex items-center gap-2 px-10 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors rounded"
                      >
                        <Circle className="h-3.5 w-3.5 shrink-0" />
                        <span>Lesson {idx + 1}</span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 px-10 py-1.5 text-sm text-muted-foreground">
                        <Circle className="h-3.5 w-3.5 shrink-0" />
                        <span>Lesson {idx + 1}</span>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

// ── Section accordion item with known lessons ────────────────────────────────

interface SectionWithLessonsProps {
  section: Section & {
    lessons?: Array<{ id: string; title: string; contentType: string; durationMinutes: number | null }>
    quizzes?: Array<{ id: string; title: string }>
  }
  courseId: string
  completedLessonIds: Set<string>
  isEnrolled: boolean
  defaultOpen?: boolean
}

function SectionWithLessons({
  section,
  courseId,
  completedLessonIds,
  isEnrolled,
  defaultOpen = false,
}: SectionWithLessonsProps) {
  const [open, setOpen] = useState(defaultOpen)
  const lessons = section.lessons ?? []
  const quizzes = section.quizzes ?? []
  const totalItems = lessons.length + quizzes.length

  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="font-medium text-sm">{section.title}</span>
        </div>
        <span className="text-xs text-muted-foreground shrink-0 ml-2">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
      </button>

      {open && (
        <div className="pb-2">
          {section.description && (
            <p className="px-10 pb-2 text-xs text-muted-foreground">{section.description}</p>
          )}

          {totalItems === 0 ? (
            <p className="px-10 py-2 text-xs text-muted-foreground italic">No content yet.</p>
          ) : (
            <ul className="space-y-0.5">
              {lessons.map((lesson) => {
                const isCompleted = completedLessonIds.has(lesson.id)
                const canAccess = isEnrolled

                return (
                  <li key={lesson.id}>
                    {canAccess ? (
                      <Link
                        href={`/courses/${courseId}/sections/${section.id}/lessons/${lesson.id}`}
                        className="flex items-center gap-2 px-10 py-1.5 text-sm hover:text-foreground hover:bg-muted/40 transition-colors rounded group"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        )}
                        <span className={isCompleted ? 'text-muted-foreground' : 'text-foreground'}>
                          {lesson.title}
                        </span>
                        {lesson.durationMinutes && (
                          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {lesson.durationMinutes}m
                          </span>
                        )}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 px-10 py-1.5 text-sm text-muted-foreground">
                        <Circle className="h-3.5 w-3.5 shrink-0" />
                        <span>{lesson.title}</span>
                        {lesson.durationMinutes && (
                          <span className="ml-auto flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            {lesson.durationMinutes}m
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}

              {quizzes.map((quiz) => (
                <li key={quiz.id}>
                  {isEnrolled ? (
                    <Link
                      href={`/courses/${courseId}/quizzes/${quiz.id}`}
                      className="flex items-center gap-2 px-10 py-1.5 text-sm hover:text-foreground hover:bg-muted/40 transition-colors rounded"
                    >
                      <ClipboardList className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{quiz.title}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        Quiz
                      </Badge>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 px-10 py-1.5 text-sm text-muted-foreground">
                      <ClipboardList className="h-3.5 w-3.5 shrink-0" />
                      <span>{quiz.title}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        Quiz
                      </Badge>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

// ── Loading skeleton ─────────────────────────────────────────────────────────

function CourseDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

interface CourseDetailProps {
  courseId: string
}

export function CourseDetail({ courseId }: CourseDetailProps) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin)
  const currentRole = useAuthStore((s) => s.currentRole)

  const isInstructor = currentRole === 'INSTRUCTOR'
  const isAdmin = isSuperAdmin || currentRole === 'TENANT_ADMIN'
  const canEdit = isInstructor || isAdmin

  const { data: course, isLoading: courseLoading, isError: courseError } = useCourse(courseId)
  const { data: sections, isLoading: sectionsLoading } = useSections(courseId)
  const { data: enrollments } = useMyEnrollments()

  const isLoading = courseLoading || sectionsLoading

  // Find enrollment for this course
  const enrollment = enrollments?.find((e) => e.courseId === courseId)
  const isEnrolled = !!enrollment
  const progressPercent = enrollment?.progressPercent ?? 0

  // Build set of completed lesson IDs from enrollment progress
  // (The Enrollment type tracks progressPercent; individual lesson completion
  //  is tracked server-side. We show progress bar only.)
  const completedLessonIds = new Set<string>()

  if (isLoading) {
    return <CourseDetailSkeleton />
  }

  if (courseError || !course) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold">Course not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This course may have been removed or you don&apos;t have access.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/courses')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </div>
    )
  }

  const sectionList = sections ?? []
  const totalLessons = sectionList.reduce((sum, s) => sum + (s.lessonsCount ?? 0), 0)

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        {course.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Course header */}
      <div className="space-y-4">
        {/* Title */}
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{course.title}</h1>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant={LEVEL_VARIANT[course.level] ?? 'secondary'}>
            {LEVEL_LABELS[course.level] ?? course.level}
          </Badge>
          <Badge variant={STATUS_VARIANT[course.status] ?? 'outline'}>{course.status}</Badge>
          {sectionList.length > 0 && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {sectionList.length} {sectionList.length === 1 ? 'section' : 'sections'}
            </span>
          )}
          {totalLessons > 0 && (
            <span className="flex items-center gap-1">
              <BarChart2 className="h-3.5 w-3.5" />
              {totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}
            </span>
          )}
        </div>

        {/* Description */}
        {course.description && (
          <p className="text-muted-foreground leading-relaxed">{course.description}</p>
        )}

        {/* CTA — Enroll / Progress / Edit */}
        {canEdit ? (
          <Button asChild size="lg">
            <Link href={`/courses/${courseId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Course
            </Link>
          </Button>
        ) : isEnrolled ? (
          <Card className="w-full max-w-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Your Progress</span>
                <span className="text-muted-foreground">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <Button asChild className="w-full" size="lg">
                <Link href={`/courses/${courseId}/sections/${sectionList[0]?.id ?? ''}/lessons`}>
                  Continue Learning →
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <EnrollButton
            courseId={courseId}
            onSuccess={() => {
              // Refresh the page to show progress bar after enrollment
              router.refresh()
            }}
          />
        )}
      </div>

      {/* Course content accordion */}
      {sectionList.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Course Content</h2>
          <Card className="overflow-hidden">
            {sectionList.map((section, idx) => (
              <SectionItem
                key={section.id}
                section={section}
                courseId={courseId}
                completedLessonIds={completedLessonIds}
                isEnrolled={isEnrolled}
                defaultOpen={idx === 0}
              />
            ))}
          </Card>
        </div>
      )}

      {sectionList.length === 0 && !isLoading && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No content has been added yet.</p>
        </div>
      )}
    </div>
  )
}
