'use client'

import Link from 'next/link'
import { BookOpen, Users, BarChart2 } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { Course } from '@/types'

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

interface CourseCardProps {
  course: Course
  /** Progress percent (0–100) shown for enrolled students */
  progressPercent?: number
  /** Show status badge (for instructors/admins) */
  showStatus?: boolean
  /** Show enrolled student count */
  enrolledCount?: number
}

export function CourseCard({
  course,
  progressPercent,
  showStatus = false,
  enrolledCount,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`} className="group block focus:outline-none">
      <Card className="h-full overflow-hidden transition-shadow duration-200 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {course.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}

          {/* Level badge overlay */}
          <div className="absolute left-2 top-2">
            <Badge variant={LEVEL_VARIANT[course.level] ?? 'secondary'}>
              {LEVEL_LABELS[course.level] ?? course.level}
            </Badge>
          </div>

          {/* Status badge overlay (instructors/admins) */}
          {showStatus && (
            <div className="absolute right-2 top-2">
              <Badge variant={STATUS_VARIANT[course.status] ?? 'outline'}>
                {course.status}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="line-clamp-2 font-semibold leading-snug text-foreground group-hover:text-primary">
            {course.title}
          </h3>

          {course.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {course.description}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            {course.sectionsCount !== undefined && (
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {course.sectionsCount} {course.sectionsCount === 1 ? 'section' : 'sections'}
              </span>
            )}
            {course.lessonsCount !== undefined && (
              <span className="flex items-center gap-1">
                <BarChart2 className="h-3.5 w-3.5" />
                {course.lessonsCount} {course.lessonsCount === 1 ? 'lesson' : 'lessons'}
              </span>
            )}
            {enrolledCount !== undefined && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {enrolledCount} {enrolledCount === 1 ? 'student' : 'students'}
              </span>
            )}
          </div>
        </CardContent>

        {/* Progress bar for enrolled students */}
        {progressPercent !== undefined && (
          <CardFooter className="px-4 pb-4 pt-0">
            <div className="w-full space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-1.5" />
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
