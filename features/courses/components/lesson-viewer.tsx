'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  BookOpen,
  FileText,
  Video,
  Music,
  FileIcon,
  Loader2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCourse } from '@/features/courses/hooks/use-course'
import { useSections } from '@/features/courses/hooks/use-sections'
import { useLessons, useLesson } from '@/features/courses/hooks/use-lessons'
import { useMyEnrollments } from '@/features/enrollments/hooks/use-enrollments'
import { useUpdateProgress } from '@/features/enrollments/hooks/use-update-progress'
import type { ContentType, Section, Lesson } from '@/types'

// ── Content type icon ─────────────────────────────────────────────────────────

function ContentTypeIcon({ type, className }: { type: ContentType; className?: string }) {
  switch (type) {
    case 'VIDEO':
      return <Video className={className} />
    case 'AUDIO':
      return <Music className={className} />
    case 'DOCUMENT':
      return <FileIcon className={className} />
    default:
      return <FileText className={className} />
  }
}

// ── Content renderer ──────────────────────────────────────────────────────────

interface ContentRendererProps {
  lesson: Lesson
}

function ContentRenderer({ lesson }: ContentRendererProps) {
  if (lesson.contentType === 'VIDEO' && lesson.mediaUrl) {
    // Support YouTube, Vimeo, or direct video URLs
    const isYouTube =
      lesson.mediaUrl.includes('youtube.com') || lesson.mediaUrl.includes('youtu.be')
    const isVimeo = lesson.mediaUrl.includes('vimeo.com')

    if (isYouTube || isVimeo) {
      // Convert to embed URL
      let embedUrl = lesson.mediaUrl
      if (isYouTube) {
        const videoId = lesson.mediaUrl.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
        )?.[1]
        if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`
      } else if (isVimeo) {
        const videoId = lesson.mediaUrl.match(/vimeo\.com\/(\d+)/)?.[1]
        if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`
      }

      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <iframe
            src={embedUrl}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      )
    }

    // Direct video file
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={lesson.mediaUrl}
          controls
          className="h-full w-full"
          title={lesson.title}
        />
      </div>
    )
  }

  if (lesson.contentType === 'AUDIO' && lesson.mediaUrl) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Music className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{lesson.title}</p>
            {lesson.durationMinutes && (
              <p className="text-xs text-muted-foreground">{lesson.durationMinutes} min</p>
            )}
          </div>
        </div>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio src={lesson.mediaUrl} controls className="w-full" />
      </div>
    )
  }

  if (lesson.contentType === 'DOCUMENT' && lesson.mediaUrl) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <FileIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div>
          <p className="font-medium">{lesson.title}</p>
          <p className="text-sm text-muted-foreground mt-1">Document attachment</p>
        </div>
        <Button asChild variant="outline">
          <a href={lesson.mediaUrl} target="_blank" rel="noopener noreferrer">
            Open Document
          </a>
        </Button>
      </div>
    )
  }

  // TEXT (default) — render content as prose
  if (lesson.content) {
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {/* Render content as plain text with line breaks preserved */}
        {lesson.content.split('\n').map((line, i) => (
          <p key={i} className="mb-3 leading-relaxed text-foreground">
            {line || <br />}
          </p>
        ))}
      </div>
    )
  }

  // Empty content fallback
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground">No content available for this lesson.</p>
    </div>
  )
}

// ── Section outline sidebar ───────────────────────────────────────────────────

interface SectionOutlineProps {
  sections: Section[]
  courseId: string
  currentSectionId: string
  currentLessonId: string
  progressPercent: number
}

function SectionOutline({
  sections,
  courseId,
  currentSectionId,
  currentLessonId,
  progressPercent,
}: SectionOutlineProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="p-4 border-b space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Course Progress</span>
          <span className="font-semibold">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {sections.map((section) => (
            <SectionOutlineItem
              key={section.id}
              section={section}
              courseId={courseId}
              currentSectionId={currentSectionId}
              currentLessonId={currentLessonId}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

interface SectionOutlineItemProps {
  section: Section
  courseId: string
  currentSectionId: string
  currentLessonId: string
}

function SectionOutlineItem({
  section,
  courseId,
  currentSectionId,
  currentLessonId,
}: SectionOutlineItemProps) {
  const isCurrentSection = section.id === currentSectionId
  const [open, setOpen] = useState(isCurrentSection)

  const { data: lessons } = useLessons(courseId, section.id)

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-medium transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate">{section.title}</span>
      </button>

      {open && lessons && lessons.length > 0 && (
        <ul className="ml-4 mt-0.5 space-y-0.5">
          {lessons.map((lesson) => {
            const isCurrent = lesson.id === currentLessonId
            return (
              <li key={lesson.id}>
                <Link
                  href={`/courses/${courseId}/sections/${section.id}/lessons/${lesson.id}`}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-muted/60 ${
                    isCurrent
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ContentTypeIcon
                    type={lesson.contentType}
                    className="h-3 w-3 shrink-0"
                  />
                  <span className="truncate">{lesson.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function LessonViewerSkeleton() {
  return (
    <div className="flex h-full gap-0">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-72 flex-col border-r">
        <div className="p-4 border-b space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-1.5 w-full" />
        </div>
        <div className="p-3 space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b px-6 py-4 space-y-1">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-6 w-72" />
        </div>
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="border-t px-6 py-4 flex justify-between">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface LessonViewerProps {
  courseId: string
  sectionId: string
  lessonId: string
}

export function LessonViewer({ courseId, sectionId, lessonId }: LessonViewerProps) {
  const router = useRouter()

  // Track time spent on lesson (seconds)
  const startTimeRef = useRef<number>(Date.now())
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0)

  useEffect(() => {
    startTimeRef.current = Date.now()
    const interval = setInterval(() => {
      setTimeSpentSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [lessonId])

  // Data fetching
  const { data: course, isLoading: courseLoading } = useCourse(courseId)
  const { data: sections, isLoading: sectionsLoading } = useSections(courseId)
  const { data: lesson, isLoading: lessonLoading, isError: lessonError } = useLesson(
    courseId,
    sectionId,
    lessonId,
  )
  const { data: lessons, isLoading: lessonsLoading } = useLessons(courseId, sectionId)
  const { data: enrollments } = useMyEnrollments()

  const updateProgress = useUpdateProgress()

  const isLoading = courseLoading || sectionsLoading || lessonLoading || lessonsLoading

  // Find enrollment for this course
  const enrollment = enrollments?.find((e) => e.courseId === courseId)
  const progressPercent = enrollment?.progressPercent ?? 0

  // Compute prev/next lesson within the same section
  const lessonList = lessons ?? []
  const currentIndex = lessonList.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? lessonList[currentIndex - 1] : null
  const nextLesson = currentIndex < lessonList.length - 1 ? lessonList[currentIndex + 1] : null

  // Find prev/next section for cross-section navigation
  const sectionList = sections ?? []
  const currentSectionIndex = sectionList.findIndex((s) => s.id === sectionId)
  const prevSection = currentSectionIndex > 0 ? sectionList[currentSectionIndex - 1] : null
  const nextSection =
    currentSectionIndex < sectionList.length - 1 ? sectionList[currentSectionIndex + 1] : null

  // Format time spent
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  const handleMarkComplete = () => {
    if (!enrollment) return
    updateProgress.mutate(
      {
        enrollmentId: enrollment.id,
        data: { lessonId, isCompleted: true },
      },
      {
        onSuccess: () => {
          // Navigate to next lesson if available
          if (nextLesson) {
            router.push(`/courses/${courseId}/sections/${sectionId}/lessons/${nextLesson.id}`)
          } else if (nextSection) {
            // Move to first lesson of next section
            router.push(`/courses/${courseId}/sections/${nextSection.id}/lessons`)
          } else {
            // Course complete — go back to course detail
            router.push(`/courses/${courseId}`)
          }
        },
      },
    )
  }

  if (isLoading) {
    return <LessonViewerSkeleton />
  }

  if (lessonError || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold">Lesson not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This lesson may have been removed or you don&apos;t have access.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => router.push(`/courses/${courseId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>
      </div>
    )
  }

  // Find current section title
  const currentSection = sectionList.find((s) => s.id === sectionId)

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* ── Sidebar: section outline ── */}
      <aside className="hidden lg:flex w-72 flex-col border-r bg-background shrink-0">
        {/* Course title */}
        <div className="px-4 py-3 border-b">
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{course?.title ?? 'Back to Course'}</span>
          </Link>
        </div>

        <SectionOutline
          sections={sectionList}
          courseId={courseId}
          currentSectionId={sectionId}
          currentLessonId={lessonId}
          progressPercent={progressPercent}
        />
      </aside>

      {/* ── Main content area ── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Lesson header */}
        <header className="border-b px-4 py-3 sm:px-6 shrink-0">
          {/* Mobile: back link */}
          <Link
            href={`/courses/${courseId}`}
            className="flex lg:hidden items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            {course?.title ?? 'Back to Course'}
          </Link>

          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {currentSection && (
                <p className="text-xs text-muted-foreground truncate mb-0.5">
                  {currentSection.title}
                </p>
              )}
              <h1 className="text-base font-semibold leading-tight sm:text-lg truncate">
                {lesson.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="hidden sm:flex items-center gap-1 text-xs">
                <ContentTypeIcon type={lesson.contentType} className="h-3 w-3" />
                {lesson.contentType}
              </Badge>
              {lesson.durationMinutes && (
                <Badge variant="secondary" className="text-xs">
                  {lesson.durationMinutes}m
                </Badge>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable lesson content */}
        <ScrollArea className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
            <ContentRenderer lesson={lesson} />
          </div>
        </ScrollArea>

        {/* Footer navigation */}
        <footer className="border-t bg-background px-4 py-3 sm:px-6 shrink-0">
          <div className="mx-auto max-w-3xl flex items-center justify-between gap-2">
            {/* Previous */}
            <Button
              variant="outline"
              size="sm"
              disabled={!prevLesson && !prevSection}
              onClick={() => {
                if (prevLesson) {
                  router.push(
                    `/courses/${courseId}/sections/${sectionId}/lessons/${prevLesson.id}`,
                  )
                } else if (prevSection) {
                  router.push(`/courses/${courseId}/sections/${prevSection.id}/lessons`)
                }
              }}
              className="shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {/* Center: time + mark complete */}
            <div className="flex min-w-0 flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground hidden sm:block">
                ⏱ {formatTime(timeSpentSeconds)}
              </span>
              {enrollment && (
                <Button
                  size="sm"
                  onClick={handleMarkComplete}
                  disabled={updateProgress.isPending}
                  className="gap-1.5 whitespace-nowrap"
                >
                  {updateProgress.isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span className="hidden xs:inline">Saving…</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span className="hidden xs:inline">Mark Complete</span>
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Next */}
            <Button
              variant="outline"
              size="sm"
              disabled={!nextLesson && !nextSection}
              onClick={() => {
                if (nextLesson) {
                  router.push(
                    `/courses/${courseId}/sections/${sectionId}/lessons/${nextLesson.id}`,
                  )
                } else if (nextSection) {
                  router.push(`/courses/${courseId}/sections/${nextSection.id}/lessons`)
                }
              }}
              className="shrink-0"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="h-3.5 w-3.5 sm:ml-1.5" />
            </Button>
          </div>

          {/* Mobile progress */}
          {enrollment && (
            <div className="mt-3 lg:hidden space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Course Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-1" />
            </div>
          )}
        </footer>
      </div>
    </div>
  )
}
