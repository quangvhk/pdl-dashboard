import { z } from 'zod'

export const createPermissionSchema = z.object({
  action: z
    .string()
    .min(1, 'Action is required')
    .max(64, 'Action must be 64 characters or fewer'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(64, 'Subject must be 64 characters or fewer'),
  conditions: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true
        try {
          JSON.parse(val)
          return true
        } catch {
          return false
        }
      },
      { message: 'Conditions must be valid JSON' },
    ),
  inverted: z.boolean().optional().default(false),
  reason: z.string().max(255, 'Reason must be 255 characters or fewer').optional(),
})

export const assignPermissionSchema = z.object({
  roleId: z.string().min(1, 'Role is required'),
  permissionId: z.string().min(1, 'Permission is required'),
})

export type CreatePermissionFormValues = z.infer<typeof createPermissionSchema>
export type AssignPermissionFormValues = z.infer<typeof assignPermissionSchema>
