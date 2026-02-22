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
import { quizzesService } from '@/lib/api/services/quizzes.service'
import { quizzesQueryKeys } from '@/features/quizzes/hooks/use-quiz'
import { sectionsQueryKeys } from '@/features/courses/hooks/use-sections'
import { quizSchema, type QuizFormValues } from '@/features/quizzes/schemas/question.schema'
import type { Quiz } from '@/types'

interface QuizFormProps {
  courseId: string
  sectionId: string
  quiz?: Quiz | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuizForm({ courseId, sectionId, quiz, open, onOpenChange }: QuizFormProps) {
  const queryClient = useQueryClient()
  const isEditing = !!quiz

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      passingScore: 70,
      timeLimitMinutes: undefined,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        title: quiz?.title ?? '',
        description: quiz?.description ?? '',
        passingScore: quiz?.passingScore ?? 70,
        timeLimitMinutes: quiz?.timeLimitMinutes ?? undefined,
      })
    }
  }, [open, quiz, reset])

  const mutation = useMutation({
    mutationFn: (data: QuizFormValues) => {
      const payload = {
        title: data.title,
        description: data.description || undefined,
        passingScore: data.passingScore,
        timeLimitMinutes: data.timeLimitMinutes ?? null,
      }
      if (isEditing && quiz) {
        return quizzesService.update(quiz.id, payload)
      }
      return quizzesService.create(courseId, sectionId, payload)
    },
    onSuccess: (updatedQuiz) => {
      if (isEditing) {
        queryClient.setQueryData(quizzesQueryKeys.detail(updatedQuiz.id), updatedQuiz)
      }
      // Invalidate sections so quiz count updates
      queryClient.invalidateQueries({ queryKey: sectionsQueryKeys.byCourse(courseId) })
      onOpenChange(false)
    },
  })

  const onSubmit = handleSubmit((data) => mutation.mutate(data))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Quiz' : 'Add Quiz'}</DialogTitle>
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
            <Label htmlFor="quiz-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="quiz-title"
              placeholder="e.g. Tone Recognition Quiz"
              {...register('title')}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quiz-description">Description</Label>
            <Textarea
              id="quiz-description"
              placeholder="Optional quiz description"
              rows={2}
              {...register('description')}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="quiz-passing-score">Passing Score (%)</Label>
              <Input
                id="quiz-passing-score"
                type="number"
                min={0}
                max={100}
                placeholder="70"
                {...register('passingScore', { valueAsNumber: true })}
                aria-invalid={!!errors.passingScore}
              />
              {errors.passingScore && (
                <p className="text-xs text-destructive">{errors.passingScore.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="quiz-time-limit">Time Limit (min)</Label>
              <Input
                id="quiz-time-limit"
                type="number"
                min={1}
                max={300}
                placeholder="No limit"
                {...register('timeLimitMinutes', { valueAsNumber: true })}
                aria-invalid={!!errors.timeLimitMinutes}
              />
              {errors.timeLimitMinutes && (
                <p className="text-xs text-destructive">{errors.timeLimitMinutes.message}</p>
              )}
            </div>
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
              {isEditing ? 'Save Changes' : 'Add Quiz'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
