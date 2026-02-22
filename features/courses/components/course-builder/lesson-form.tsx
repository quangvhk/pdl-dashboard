'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { lessonsService } from '@/lib/api/services/lessons.service'
import { lessonsQueryKeys } from '@/features/courses/hooks/use-lessons'
import { lessonSchema, type LessonFormValues } from '@/features/courses/schemas/lesson.schema'
import type { Lesson } from '@/types'

interface LessonFormProps {
  courseId: string
  sectionId: string
  lesson?: Lesson | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CONTENT_TYPE_OPTIONS = [
  { value: 'TEXT', label: 'Text' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'AUDIO', label: 'Audio' },
  { value: 'DOCUMENT', label: 'Document' },
] as const

export function LessonForm({
  courseId,
  sectionId,
  lesson,
  open,
  onOpenChange,
}: LessonFormProps) {
  const queryClient = useQueryClient()
  const isEditing = !!lesson

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      contentType: 'TEXT',
      content: '',
      mediaUrl: '',
      durationMinutes: undefined,
    },
  })

  const contentType = watch('contentType')

  // Populate form when editing
  useEffect(() => {
    if (open) {
      reset({
        title: lesson?.title ?? '',
        contentType: lesson?.contentType ?? 'TEXT',
        content: lesson?.content ?? '',
        mediaUrl: lesson?.mediaUrl ?? '',
        durationMinutes: lesson?.durationMinutes ?? undefined,
      })
    }
  }, [open, lesson, reset])

  const mutation = useMutation({
    mutationFn: (data: LessonFormValues) => {
      const payload = {
        title: data.title,
        contentType: data.contentType,
        content: data.content || undefined,
        mediaUrl: data.mediaUrl || undefined,
        durationMinutes: data.durationMinutes,
      }
      if (isEditing && lesson) {
        return lessonsService.update(courseId, sectionId, lesson.id, payload)
      }
      return lessonsService.create(courseId, sectionId, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: lessonsQueryKeys.bySection(courseId, sectionId),
      })
      onOpenChange(false)
    },
  })

  const onSubmit = handleSubmit((data) => mutation.mutate(data))

  const needsMediaUrl = contentType === 'VIDEO' || contentType === 'AUDIO' || contentType === 'DOCUMENT'
  const needsContent = contentType === 'TEXT'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {mutation.isError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {mutation.error instanceof Error
                ? mutation.error.message
                : 'Something went wrong. Please try again.'}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="lesson-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lesson-title"
              placeholder="e.g. The Four Tones"
              {...register('title')}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lesson-content-type">
              Content Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={contentType}
              onValueChange={(val) =>
                setValue('contentType', val as LessonFormValues['contentType'], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="lesson-content-type">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.contentType && (
              <p className="text-xs text-destructive">{errors.contentType.message}</p>
            )}
          </div>

          {needsContent && (
            <div className="space-y-1.5">
              <Label htmlFor="lesson-content">Content</Label>
              <Textarea
                id="lesson-content"
                placeholder="Lesson text content..."
                rows={5}
                {...register('content')}
                aria-invalid={!!errors.content}
              />
              {errors.content && (
                <p className="text-xs text-destructive">{errors.content.message}</p>
              )}
            </div>
          )}

          {needsMediaUrl && (
            <div className="space-y-1.5">
              <Label htmlFor="lesson-media-url">
                {contentType === 'VIDEO' ? 'Video URL' : contentType === 'AUDIO' ? 'Audio URL' : 'Document URL'}
              </Label>
              <Input
                id="lesson-media-url"
                type="url"
                placeholder="https://..."
                {...register('mediaUrl')}
                aria-invalid={!!errors.mediaUrl}
              />
              {errors.mediaUrl && (
                <p className="text-xs text-destructive">{errors.mediaUrl.message}</p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="lesson-duration">Duration (minutes)</Label>
            <Input
              id="lesson-duration"
              type="number"
              min={1}
              max={600}
              placeholder="e.g. 15"
              {...register('durationMinutes', { valueAsNumber: true })}
              aria-invalid={!!errors.durationMinutes}
            />
            {errors.durationMinutes && (
              <p className="text-xs text-destructive">{errors.durationMinutes.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Add Lesson'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
