'use client'

import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
import { quizzesService } from '@/lib/api/services/quizzes.service'
import { quizzesQueryKeys } from '@/features/quizzes/hooks/use-quiz'
import {
  questionSchema,
  type QuestionFormValues,
} from '@/features/quizzes/schemas/question.schema'
import type { QuizQuestion } from '@/types'

interface QuestionFormProps {
  quizId: string
  question?: QuizQuestion | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const QUESTION_TYPE_OPTIONS = [
  { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
  { value: 'TRUE_FALSE', label: 'True / False' },
  { value: 'FILL_IN_BLANK', label: 'Fill in the Blank' },
] as const

const TRUE_FALSE_ANSWERS = [
  { answer: 'True', isCorrect: true, sortOrder: 0 },
  { answer: 'False', isCorrect: false, sortOrder: 1 },
]

export function QuestionForm({ quizId, question, open, onOpenChange }: QuestionFormProps) {
  const queryClient = useQueryClient()
  const isEditing = !!question

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: '',
      questionType: 'MULTIPLE_CHOICE',
      points: 1,
      answers: [
        { answer: '', isCorrect: false, sortOrder: 0 },
        { answer: '', isCorrect: false, sortOrder: 1 },
      ],
    },
  })

  const { fields, append, remove, replace } = useFieldArray({ control, name: 'answers' })
  const questionType = watch('questionType')

  // Populate form when editing or reset on open
  useEffect(() => {
    if (open) {
      if (question) {
        reset({
          question: question.question,
          questionType: question.questionType,
          points: question.points,
          answers: question.answers?.map((a, i) => ({
            id: a.id,
            answer: a.answer,
            isCorrect: false, // isCorrect not exposed to students; default false for editing
            sortOrder: a.sortOrder ?? i,
          })) ?? [
            { answer: '', isCorrect: false, sortOrder: 0 },
            { answer: '', isCorrect: false, sortOrder: 1 },
          ],
        })
      } else {
        reset({
          question: '',
          questionType: 'MULTIPLE_CHOICE',
          points: 1,
          answers: [
            { answer: '', isCorrect: false, sortOrder: 0 },
            { answer: '', isCorrect: false, sortOrder: 1 },
          ],
        })
      }
    }
  }, [open, question, reset])

  // When question type changes, adjust answers
  useEffect(() => {
    if (questionType === 'TRUE_FALSE') {
      replace(TRUE_FALSE_ANSWERS)
    } else if (questionType === 'FILL_IN_BLANK') {
      replace([{ answer: '', isCorrect: true, sortOrder: 0 }])
    }
    // MULTIPLE_CHOICE: keep existing answers
  }, [questionType, replace])

  const mutation = useMutation({
    mutationFn: (data: QuestionFormValues) => {
      const payload = {
        question: data.question,
        questionType: data.questionType,
        points: data.points,
        answers: data.answers.map((a, i) => ({
          id: a.id,
          answer: a.answer,
          isCorrect: a.isCorrect,
          sortOrder: i,
        })),
      }
      if (isEditing && question) {
        return quizzesService.updateQuestion(quizId, question.id, payload)
      }
      return quizzesService.addQuestion(quizId, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizzesQueryKeys.detail(quizId) })
      onOpenChange(false)
    },
  })

  const onSubmit = handleSubmit((data) => mutation.mutate(data))

  const isTrueFalse = questionType === 'TRUE_FALSE'
  const isFillInBlank = questionType === 'FILL_IN_BLANK'
  const isMultipleChoice = questionType === 'MULTIPLE_CHOICE'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Question' : 'Add Question'}</DialogTitle>
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
            <Label htmlFor="q-type">
              Question Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={questionType}
              onValueChange={(val) =>
                setValue('questionType', val as QuestionFormValues['questionType'], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="q-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {QUESTION_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="q-text">
              Question <span className="text-destructive">*</span>
            </Label>
            <Input
              id="q-text"
              placeholder="Enter your question..."
              {...register('question')}
              aria-invalid={!!errors.question}
            />
            {errors.question && (
              <p className="text-xs text-destructive">{errors.question.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="q-points">Points</Label>
            <Input
              id="q-points"
              type="number"
              min={1}
              max={100}
              placeholder="1"
              {...register('points', { valueAsNumber: true })}
              aria-invalid={!!errors.points}
            />
            {errors.points && (
              <p className="text-xs text-destructive">{errors.points.message}</p>
            )}
          </div>

          {/* Answers section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                Answers <span className="text-destructive">*</span>
              </Label>
              {isMultipleChoice && fields.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ answer: '', isCorrect: false, sortOrder: fields.length })
                  }
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Answer
                </Button>
              )}
            </div>

            {typeof errors.answers === 'object' && !Array.isArray(errors.answers) && (
              <p className="text-xs text-destructive">
                {(errors.answers as { message?: string }).message}
              </p>
            )}

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  {/* Correct checkbox — hidden for fill-in-blank (always correct) */}
                  {!isFillInBlank && (
                    <Checkbox
                      id={`answer-correct-${index}`}
                      checked={watch(`answers.${index}.isCorrect`)}
                      onCheckedChange={(checked) =>
                        setValue(`answers.${index}.isCorrect`, !!checked, {
                          shouldValidate: true,
                        })
                      }
                      aria-label="Mark as correct"
                      disabled={isTrueFalse}
                    />
                  )}

                  <Input
                    placeholder={
                      isFillInBlank
                        ? 'Correct answer...'
                        : isTrueFalse
                          ? field.answer
                          : `Option ${index + 1}`
                    }
                    readOnly={isTrueFalse}
                    {...register(`answers.${index}.answer`)}
                    aria-invalid={!!errors.answers?.[index]?.answer}
                    className="flex-1"
                  />

                  {/* Remove button — only for multiple choice with >2 answers */}
                  {isMultipleChoice && fields.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      aria-label="Remove answer"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {!isFillInBlank && (
              <p className="text-xs text-muted-foreground">
                Check the box next to the correct answer(s).
              </p>
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
              {isEditing ? 'Save Changes' : 'Add Question'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
