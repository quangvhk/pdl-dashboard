import { z } from 'zod'

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(64, 'Name must be 64 characters or fewer')
    .regex(/^[A-Z0-9_]+$/, 'Name must be uppercase letters, digits, or underscores (e.g. CUSTOM_ROLE)'),
  description: z.string().max(255, 'Description must be 255 characters or fewer').optional(),
})

export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(64, 'Name must be 64 characters or fewer')
    .regex(/^[A-Z0-9_]+$/, 'Name must be uppercase letters, digits, or underscores')
    .optional(),
  description: z.string().max(255, 'Description must be 255 characters or fewer').optional(),
})

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>
export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>
