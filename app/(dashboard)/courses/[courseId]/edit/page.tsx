'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  BookOpen,
  Globe,
  Archive,
  Trash2,
  Lock,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { PageHeader } from '@/components/shared/page-header'
import { SectionList } from '@/features/courses/components/course-builder/section-list'
import { useCourse } from '@/features/courses/hooks/use-course'
import {
  useUpdateCourse,
  usePublishCourse,
  useArchiveCourse,
  useDeleteCourse,
} from '@/features/courses/hooks/use-update-course'
import { createCourseSchema, type CreateCourseFormValues } from '@/features/courses/schemas/course.schema'
import { useAuthStore } from '@/stores/auth.store'
import type { CourseLevel } from '@/types'

const LEVEL_OPTIONS: { value: CourseLevel; label: string }[] = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
]

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  DRAFT: 'secondary',
  PUBLISHED: 'default',
  ARCHIVED: 'outline',
}

interface PageProps {
  params: Promise<{ courseId: string }>
}

export default function CourseEditPage({ params }: PageProps) {
  const { courseId } = use(params)
  const router = useRouter()
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin)
  const currentRole = useAuthStore((s) => s.currentRole)

  const canEdit =
    isSuperAdmin || currentRole === 'INSTRUCTOR' || currentRole === 'TENANT_ADMIN'

  const { data: course, isLoading, error: fetchError } = useCourse(courseId)

  const updateMutation = useUpdateCourse(courseId)
  const publishMutation = usePublishCourse(courseId)
  const archiveMutation = useArchiveCourse(courseId)
  const deleteMutation = useDeleteCourse(courseId)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: { title: '', description: '', level: 'BEGINNER', thumbnail: '' },
  })

  const level = watch('level')

  // Populate form once course data loads
  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        description: course.description ?? '',
        level: course.level,
        thumbnail: course.thumbnail ?? '',
      })
    }
  }, [course, reset])

  const onSave = handleSubmit((data) => {
    updateMutation.mutate({
      title: data.title,
      description: data.description || null,
      level: data.level,
      thumbnail: data.thumbnail || null,
    })
  })

  // Role gate
  if (!canEdit) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <Lock className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Access Restricted</h2>
        <p className="text-muted-foreground">Only instructors and admins can edit courses.</p>
        <Button asChild variant="outline">
          <Link href="/courses">Back to Courses</Link>
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  if (fetchError || !course) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Course Not Found</h2>
        <p className="text-muted-foreground">
          {fetchError instanceof Error ? fetchError.message : 'Could not load this course.'}
        </p>
        <Button asChild variant="outline">
          <Link href="/courses">Back to Courses</Link>
        </Button>
      </div>
    )
  }

  const isPublished = course.status === 'PUBLISHED'
  const isArchived = course.status === 'ARCHIVED'
  const isDraft = course.status === 'DRAFT'
  const anyPending =
    updateMutation.isPending ||
    publishMutation.isPending ||
    archiveMutation.isPending ||
    deleteMutation.isPending

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit: ${course.title}`}
        description={`${course.sectionsCount ?? 0} section${(course.sectionsCount ?? 0) !== 1 ? 's' : ''}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_VARIANT[course.status] ?? 'outline'}>{course.status}</Badge>
            <Button asChild variant="outline" size="sm">
              <Link href={`/courses/${courseId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back to Course</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>

            {/* Publish */}
            {(isDraft || isArchived) && (
              <Button
                size="sm"
                onClick={() => publishMutation.mutate()}
                disabled={anyPending}
              >
                {publishMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Globe className="mr-2 h-4 w-4" />
                )}
                Publish
              </Button>
            )}

            {/* Archive */}
            {isPublished && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => archiveMutation.mutate()}
                disabled={anyPending}
              >
                {archiveMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Archive className="mr-2 h-4 w-4" />
                )}
                Archive
              </Button>
            )}

            {/* Delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" disabled={anyPending}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Course</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to permanently delete &quot;{course.title}&quot;? All
                    sections, lessons, and quizzes will be removed. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteMutation.mutate(undefined, {
                        onSuccess: () => router.push('/courses'),
                      })
                    }
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete Course
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      {/* Course Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave} className="space-y-4">
            {updateMutation.isError && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {updateMutation.error instanceof Error
                    ? updateMutation.error.message
                    : 'Failed to save changes. Please try again.'}
                </span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="edit-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-title"
                placeholder="Course title"
                {...register('title')}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe what students will learn..."
                rows={4}
                {...register('description')}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-level">
                  Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={level}
                  onValueChange={(val) =>
                    setValue('level', val as CourseLevel, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="edit-level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVEL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.level && (
                  <p className="text-xs text-destructive">{errors.level.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="edit-thumbnail"
                    type="url"
                    placeholder="https://..."
                    className="pl-9"
                    {...register('thumbnail')}
                    aria-invalid={!!errors.thumbnail}
                  />
                </div>
                {errors.thumbnail && (
                  <p className="text-xs text-destructive">{errors.thumbnail.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={!isDirty || updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Course Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Course Content</h2>
        </div>
        <SectionList courseId={courseId} />
      </div>
    </div>
  )
}
