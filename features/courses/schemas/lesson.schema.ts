import { z } from 'zod'

export const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  contentType: z.enum(['TEXT', 'VIDEO', 'AUDIO', 'DOCUMENT']),
  content: z.string().max(50000, 'Content is too long').optional().or(z.literal('')),
  mediaUrl: z
    .string()
    .url('Media URL must be a valid URL')
    .optional()
    .or(z.literal('')),
  durationMinutes: z
    .number()
    .int('Duration must be a whole number')
    .min(1, 'Duration must be at least 1 minute')
    .max(600, 'Duration must be 600 minutes or less')
    .optional(),
})

export type LessonFormValues = z.infer<typeof lessonSchema>
