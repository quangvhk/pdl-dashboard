import { z } from 'zod'

export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'First name must be 100 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name must be 100 characters or less'),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
})

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
