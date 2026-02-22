import { z } from 'zod'

export const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'First name must be 100 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name must be 100 characters or less'),
  email: z.string().min(1, 'Email is required').email('Must be a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'First name must be 100 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name must be 100 characters or less'),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
})

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
