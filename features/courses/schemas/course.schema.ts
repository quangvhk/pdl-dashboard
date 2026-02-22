import { z } from 'zod'

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().max(2000, 'Description must be 2000 characters or less').optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  thumbnail: z
    .string()
    .url('Thumbnail must be a valid URL')
    .optional()
    .or(z.literal('')),
})

export type CreateCourseFormValues = z.infer<typeof createCourseSchema>
