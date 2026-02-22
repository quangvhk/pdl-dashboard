'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, AlertCircle, BookOpen } from 'lucide-react'
import {
  createCourseSchema,
  type CreateCourseFormValues,
} from '@/features/courses/schemas/course.schema'
import { useCreateCourse } from '@/features/courses/hooks/use-create-course'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CourseLevel } from '@/types'

const LEVEL_OPTIONS: { value: CourseLevel; label: string; description: string }[] = [
  { value: 'BEGINNER', label: 'Beginner', description: 'No prior knowledge required' },
  { value: 'INTERMEDIATE', label: 'Intermediate', description: 'Some experience needed' },
  { value: 'ADVANCED', label: 'Advanced', description: 'Significant experience required' },
]

interface CourseFormProps {
  onCancel?: () => void
}

export function CourseForm({ onCancel }: CourseFormProps) {
  const { mutate: createCourse, isPending, error } = useCreateCourse()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCourseFormValues, unknown, CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      description: '',
      level: 'BEGINNER',
      thumbnail: '',
    },
  })

  const level = watch('level')

  const onSubmit = (data: CreateCourseFormValues) => {
    createCourse({
      title: data.title,
      description: data.description || undefined,
      level: data.level,
      thumbnail: data.thumbnail || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* API error banner */}
      {error && (
        <div className="bg-destructive/10 border-destructive/30 text-destructive flex items-start gap-2 rounded-lg border p-3 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {error instanceof Error ? error.message : 'Failed to create course. Please try again.'}
          </span>
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">
          Course Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g. Mandarin Chinese for Beginners"
          aria-invalid={!!errors.title}
          {...register('title')}
        />
        {errors.title && (
          <p className="text-destructive text-xs">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe what students will learn in this course..."
          rows={4}
          aria-invalid={!!errors.description}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-destructive text-xs">{errors.description.message}</p>
        )}
        <p className="text-muted-foreground text-xs">
          A clear description helps students understand what to expect.
        </p>
      </div>

      {/* Level */}
      <div className="space-y-1.5">
        <Label htmlFor="level">
          Difficulty Level <span className="text-destructive">*</span>
        </Label>
        <Select
          value={level}
          onValueChange={(value) => setValue('level', value as CourseLevel, { shouldValidate: true })}
        >
          <SelectTrigger id="level" aria-invalid={!!errors.level}>
            <SelectValue placeholder="Select a level" />
          </SelectTrigger>
          <SelectContent>
            {LEVEL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <div className="flex flex-col">
                  <span>{opt.label}</span>
                  <span className="text-muted-foreground text-xs">{opt.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.level && (
          <p className="text-destructive text-xs">{errors.level.message}</p>
        )}
      </div>

      {/* Thumbnail URL */}
      <div className="space-y-1.5">
        <Label htmlFor="thumbnail">Thumbnail URL</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <BookOpen className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              id="thumbnail"
              type="url"
              placeholder="https://example.com/image.jpg"
              className="pl-9"
              aria-invalid={!!errors.thumbnail}
              {...register('thumbnail')}
            />
          </div>
        </div>
        {errors.thumbnail && (
          <p className="text-destructive text-xs">{errors.thumbnail.message}</p>
        )}
        <p className="text-muted-foreground text-xs">
          Optional. Paste a URL to an image for the course thumbnail.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Creating…' : 'Create Course'}
        </Button>
      </div>
    </form>
  )
}
