'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Lock } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { CourseForm } from '@/features/courses/components/course-form'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewCoursePage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  const roles = user?.roles ?? []
  const canCreate =
    roles.includes('INSTRUCTOR') ||
    roles.includes('TENANT_ADMIN') ||
    roles.includes('SUPER_ADMIN')

  // Role gate — students cannot access this page
  if (!canCreate) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Lock className="text-muted-foreground h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold">Access Restricted</h2>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          Only instructors and administrators can create courses.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => router.push('/courses')}>
          Back to Courses
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Course"
        description="Set up the basic details for your course. You can add sections, lessons, and quizzes after creation."
        actions={
          <Button variant="outline" size="sm" onClick={() => router.push('/courses')}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Courses
          </Button>
        }
      />

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>
              Fill in the basic information about your course. After creating it, you&apos;ll be
              taken to the course editor where you can add content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CourseForm onCancel={() => router.push('/courses')} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
