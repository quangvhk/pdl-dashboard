import { z } from 'zod'

export const changeRoleSchema = z.object({
  roleId: z.string().min(1, 'Role is required'),
})

export type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>
