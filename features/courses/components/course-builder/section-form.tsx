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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { sectionsService } from '@/lib/api/services/sections.service'
import { sectionsQueryKeys } from '@/features/courses/hooks/use-sections'
import { sectionSchema, type SectionFormValues } from '@/features/courses/schemas/section.schema'
import type { Section } from '@/types'

interface SectionFormProps {
  courseId: string
  section?: Section | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SectionForm({ courseId, section, open, onOpenChange }: SectionFormProps) {
  const queryClient = useQueryClient()
  const isEditing = !!section

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: { title: '', description: '' },
  })

  // Populate form when editing
  useEffect(() => {
    if (open) {
      reset({
        title: section?.title ?? '',
        description: section?.description ?? '',
      })
    }
  }, [open, section, reset])

  const mutation = useMutation({
    mutationFn: (data: SectionFormValues) => {
      const payload = {
        title: data.title,
        description: data.description || undefined,
      }
      if (isEditing && section) {
        return sectionsService.update(courseId, section.id, payload)
      }
      return sectionsService.create(courseId, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionsQueryKeys.byCourse(courseId) })
      onOpenChange(false)
    },
  })

  const onSubmit = handleSubmit((data) => mutation.mutate(data))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Section' : 'Add Section'}</DialogTitle>
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
            <Label htmlFor="section-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="section-title"
              placeholder="e.g. Introduction to Tones"
              {...register('title')}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="section-description">Description</Label>
            <Textarea
              id="section-description"
              placeholder="Optional section description"
              rows={3}
              {...register('description')}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
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
              {isEditing ? 'Save Changes' : 'Add Section'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
