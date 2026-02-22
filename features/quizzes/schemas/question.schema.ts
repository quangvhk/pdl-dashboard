import { z } from 'zod'

export const answerSchema = z.object({
  id: z.string().optional(),
  answer: z.string().min(1, 'Answer text is required').max(500, 'Answer must be 500 characters or less'),
  isCorrect: z.boolean(),
  sortOrder: z.number().int().optional(),
})

export const questionSchema = z.object({
  question: z.string().min(1, 'Question text is required').max(1000, 'Question must be 1000 characters or less'),
  questionType: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_BLANK']),
  points: z
    .number()
    .int('Points must be a whole number')
    .min(1, 'Points must be at least 1')
    .max(100, 'Points must be 100 or less')
    .optional(),
  answers: z
    .array(answerSchema)
    .min(2, 'At least 2 answers are required')
    .max(6, 'Maximum 6 answers allowed'),
}).refine(
  (data) => {
    if (data.questionType === 'FILL_IN_BLANK') return true
    return data.answers.some((a) => a.isCorrect)
  },
  { message: 'At least one answer must be marked as correct', path: ['answers'] },
)

export const quizSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .or(z.literal('')),
  passingScore: z
    .number()
    .int('Passing score must be a whole number')
    .min(0, 'Passing score must be 0 or more')
    .max(100, 'Passing score must be 100 or less')
    .optional(),
  timeLimitMinutes: z
    .number()
    .int('Time limit must be a whole number')
    .min(1, 'Time limit must be at least 1 minute')
    .max(300, 'Time limit must be 300 minutes or less')
    .nullable()
    .optional(),
})

export type AnswerFormValues = z.infer<typeof answerSchema>
export type QuestionFormValues = z.infer<typeof questionSchema>
export type QuizFormValues = z.infer<typeof quizSchema>
