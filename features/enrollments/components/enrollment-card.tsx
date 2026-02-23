'use client'

import Link from 'next/link'
import { BookOpen, Calendar, CheckCircle2, Clock, PlayCircle, UserCheck } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import type { Enrollment } from '@/types'

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

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }
> = {
  ACTIVE: { label: 'In Progress', variant: 'default', icon: Clock },
  COMPLETED: { label: 'Completed', variant: 'secondary', icon: CheckCircle2 },
  DROPPED: { label: 'Dropped', variant: 'outline', icon: BookOpen },
}

interface EnrollmentCardProps {
  enrollment: Enrollment
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const course = enrollment.course
  const statusConfig = STATUS_CONFIG[enrollment.status] ?? STATUS_CONFIG.ACTIVE
  const StatusIcon = statusConfig.icon

  const enrolledDate = enrollment.enrolledAt
    ? format(new Date(enrollment.enrolledAt), 'MMM d, yyyy')
    : null

  const completedDate = enrollment.completedAt
    ? format(new Date(enrollment.completedAt), 'MMM d, yyyy')
    : null

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {course?.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}

        {/* Level badge */}
        {course?.level && (
          <div className="absolute left-2 top-2">
            <Badge variant={LEVEL_VARIANT[course.level] ?? 'secondary'}>
              {LEVEL_LABELS[course.level] ?? course.level}
            </Badge>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute right-2 top-2">
          <Badge variant={statusConfig.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug text-foreground">
          {course?.title ?? 'Untitled Course'}
        </h3>

        {/* Dates */}
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          {enrolledDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>Enrolled {enrolledDate}</span>
            </div>
          )}
          {completedDate && (
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
              <span>Completed {completedDate}</span>
            </div>
          )}
          {/* Granted-by indicator */}
          <div className="flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 shrink-0" />
            {enrollment.grantedBy ? (
              <span>Granted by admin</span>
            ) : (
              <span>Self-enrolled</span>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-medium">{enrollment.progressPercent}%</span>
          </div>
          <Progress
            value={enrollment.progressPercent}
            className="h-2"
          />
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">
        {enrollment.status === 'COMPLETED' ? (
          <Button asChild variant="outline" className="w-full" size="sm">
            <Link href={`/courses/${enrollment.courseId}`}>
              <BookOpen className="mr-2 h-4 w-4" />
              View Course
            </Link>
          </Button>
        ) : (
          <Button asChild className="w-full" size="sm">
            <Link href={`/courses/${enrollment.courseId}`}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Continue Learning
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export function EnrollmentCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full bg-muted" />
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
        </div>
        <div className="mt-3 space-y-1">
          <div className="flex justify-between">
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-3 w-8 rounded bg-muted" />
          </div>
          <div className="h-2 w-full rounded-full bg-muted" />
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <div className="h-9 w-full rounded bg-muted" />
      </CardFooter>
    </Card>
  )
}
