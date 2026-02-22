import { z } from 'zod'

// ─── Create Tenant Schema ───────────────────────────────────────────────────────

export const createTenantSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be 200 characters or less'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be 100 characters or less')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug may only contain lowercase letters, numbers, and hyphens',
    ),
  domain: z
    .string()
    .max(253, 'Domain must be 253 characters or less')
    .optional()
    .or(z.literal('')),
})

export type CreateTenantFormValues = z.infer<typeof createTenantSchema>

// ─── Update Tenant Schema ───────────────────────────────────────────────────────

export const updateTenantSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be 200 characters or less'),
  domain: z
    .string()
    .max(253, 'Domain must be 253 characters or less')
    .optional()
    .or(z.literal('')),
})

export type UpdateTenantFormValues = z.infer<typeof updateTenantSchema>
