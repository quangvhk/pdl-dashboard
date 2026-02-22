'use client'

import Link from 'next/link'
import {
  BookOpen,
  Users,
  GraduationCap,
  Building2,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CourseCard } from '@/features/courses/components/course-card'
import { useCourses } from '@/features/courses/hooks/use-courses'
import { useMyEnrollments } from '@/features/enrollments/hooks/use-enrollments'
import { useAuthStore } from '@/stores/auth.store'
import type { Enrollment } from '@/types'

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: number | string
  description?: string
  className?: string
}

function StatCard({ icon: Icon, label, value, description, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Student Dashboard ────────────────────────────────────────────────────────

function StudentDashboard({ firstName }: { firstName: string }) {
  const { data: enrollments, isLoading } = useMyEnrollments()

  const enrolled = enrollments?.length ?? 0
  const inProgress = enrollments?.filter((e) => e.status === 'ACTIVE').length ?? 0
  const completed = enrollments?.filter((e) => e.status === 'COMPLETED').length ?? 0

  // Sort by most recently active (highest progress first for in-progress)
  const continueLearning: Enrollment[] = (enrollments ?? [])
    .filter((e) => e.status === 'ACTIVE' && e.progressPercent < 100)
    .sort((a, b) => b.progressPercent - a.progressPercent)
    .slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {firstName}! 👋</h1>
        <p className="mt-1 text-muted-foreground">
          Pick up where you left off or explore new courses.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard icon={BookOpen} label="Enrolled" value={enrolled} />
            <StatCard icon={Clock} label="In Progress" value={inProgress} />
            <StatCard icon={CheckCircle2} label="Completed" value={completed} />
          </>
        )}
      </div>

      {/* Continue Learning */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Continue Learning</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/enrollments">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : continueLearning.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <GraduationCap className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-medium">No courses in progress</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse the catalog to find your next course.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {continueLearning.map((enrollment) => (
              <Card key={enrollment.id} className="transition-shadow hover:shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {enrollment.course?.title ?? 'Course'}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{enrollment.progressPercent}%</span>
                        </div>
                        <Progress value={enrollment.progressPercent} className="h-1.5" />
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild className="shrink-0">
                      <Link href={`/courses/${enrollment.courseId}`}>
                        Continue <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Browse link */}
      <div className="flex justify-end">
        <Button variant="outline" asChild>
          <Link href="/courses">
            Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

// ─── Instructor Dashboard ─────────────────────────────────────────────────────

function InstructorDashboard({ firstName }: { firstName: string }) {
  const { data: courses, isLoading } = useCourses()

  const totalCourses = courses?.length ?? 0
  const published = courses?.filter((c) => c.status === 'PUBLISHED').length ?? 0
  const drafts = courses?.filter((c) => c.status === 'DRAFT').length ?? 0

  const recentCourses = (courses ?? []).slice(0, 4)

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {firstName}! 👋</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your courses and track student progress.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard icon={BookOpen} label="My Courses" value={totalCourses} />
            <StatCard icon={CheckCircle2} label="Published" value={published} />
            <StatCard icon={Clock} label="Drafts" value={drafts} />
          </>
        )}
      </div>

      {/* My Courses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Courses</h2>
          <Button size="sm" asChild>
            <Link href="/courses/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Create New Course
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <Skeleton className="aspect-video w-full" />
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentCourses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-medium">No courses yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first course to get started.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/courses/new">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create Course
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentCourses.map((course) => (
              <CourseCard key={course.id} course={course} showStatus />
            ))}
          </div>
        )}
      </div>

      {courses && courses.length > 4 && (
        <div className="flex justify-end">
          <Button variant="outline" asChild>
            <Link href="/courses">
              View All Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

// ─── Tenant Admin Dashboard ───────────────────────────────────────────────────

function TenantAdminDashboard({ tenantName }: { tenantName?: string }) {
  const { data: courses, isLoading: coursesLoading } = useCourses()

  const totalCourses = courses?.length ?? 0
  const published = courses?.filter((c) => c.status === 'PUBLISHED').length ?? 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{tenantName ?? 'Tenant'} Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your organisation's learning activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {coursesLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard icon={Users} label="Users" value="—" description="Manage in Users tab" />
            <StatCard icon={BookOpen} label="Courses" value={totalCourses} />
            <StatCard icon={TrendingUp} label="Published" value={published} />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/users">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/courses">
              <BookOpen className="mr-2 h-4 w-4" />
              View Courses
            </Link>
          </Button>
          <Button asChild>
            <Link href="/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Courses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Courses</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/courses">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {coursesLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <Skeleton className="aspect-video w-full" />
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(courses ?? []).slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} showStatus />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Super Admin Dashboard ────────────────────────────────────────────────────

function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Platform-wide overview and management.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={Building2}
          label="Tenants"
          value="—"
          description="View in Tenants tab"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value="—"
          description="Across all tenants"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/tenants">
              <Building2 className="mr-2 h-4 w-4" />
              Manage Tenants
            </Link>
          </Button>
          <Button asChild>
            <Link href="/tenants/new">
              <Plus className="mr-2 h-4 w-4" />
              New Tenant
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Tenant status overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tenant Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Active tenants shown in Tenants page</Badge>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Navigate to{' '}
            <Link href="/tenants" className="text-primary underline-offset-4 hover:underline">
              Tenants
            </Link>{' '}
            to view and manage all tenant organisations.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    )
  }

  const roles = user.roles ?? []
  const firstName = user.firstName

  if (roles.includes('SUPER_ADMIN')) {
    return <SuperAdminDashboard />
  }

  if (roles.includes('TENANT_ADMIN')) {
    return <TenantAdminDashboard tenantName={undefined} />
  }

  if (roles.includes('INSTRUCTOR')) {
    return <InstructorDashboard firstName={firstName} />
  }

  // Default: STUDENT
  return <StudentDashboard firstName={firstName} />
}
