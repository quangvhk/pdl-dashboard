import { z } from 'zod'

export const sectionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .or(z.literal('')),
})

export type SectionFormValues = z.infer<typeof sectionSchema>
