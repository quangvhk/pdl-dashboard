import { z } from 'zod'

export const createInvitationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  roleId: z.string().min(1, 'Role is required'),
})

export type CreateInvitationFormValues = z.infer<typeof createInvitationSchema>

export const acceptInvitationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

export type AcceptInvitationFormValues = z.infer<typeof acceptInvitationSchema>
