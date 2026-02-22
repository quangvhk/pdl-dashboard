import { z } from 'zod'

/**
 * Schema for a single answer within a quiz submission.
 * Either answerId (MC/TF) or textAnswer (FILL_IN_BLANK) must be provided.
 */
export const submitAnswerSchema = z
  .object({
    questionId: z.string().min(1, 'Question ID is required'),
    answerId: z.string().optional(),
    textAnswer: z.string().optional(),
  })
  .refine((val) => val.answerId !== undefined || (val.textAnswer !== undefined && val.textAnswer.trim().length > 0), {
    message: 'An answer is required',
    path: ['answerId'],
  })

/**
 * Schema for submitting a full quiz attempt.
 */
export const submitQuizSchema = z.object({
  enrollmentId: z.string().min(1, 'Enrollment ID is required'),
  answers: z.array(submitAnswerSchema).min(1, 'At least one answer is required'),
})

export type SubmitAnswerValues = z.infer<typeof submitAnswerSchema>
export type SubmitQuizValues = z.infer<typeof submitQuizSchema>
