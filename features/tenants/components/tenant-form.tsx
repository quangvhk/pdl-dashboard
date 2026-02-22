'use client'

import { Loader2, AlertCircle, Building2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTenantSchema, type CreateTenantFormValues } from '@/features/tenants/schemas/tenant.schema'
import { useCreateTenant } from '@/features/tenants/hooks/use-create-tenant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ─── Props ──────────────────────────────────────────────────────────────────────

interface TenantFormProps {
  onCancel?: () => void
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function TenantForm({ onCancel }: TenantFormProps) {
  const { mutate: createTenant, isPending, error } = useCreateTenant()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTenantFormValues, unknown, CreateTenantFormValues>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      name: '',
      slug: '',
      domain: '',
    },
  })

  const apiError = error instanceof Error ? error.message : error ? 'Failed to create tenant.' : null

  const onSubmit = (data: CreateTenantFormValues) => {
    createTenant({
      name: data.name,
      slug: data.slug,
      domain: data.domain || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* API error banner */}
      {apiError && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {apiError}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Beijing Language Academy"
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-destructive text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="slug">
          Slug <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Building2 className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            id="slug"
            type="text"
            placeholder="beijing-academy"
            className="pl-9"
            aria-invalid={!!errors.slug}
            {...register('slug')}
          />
        </div>
        {errors.slug ? (
          <p className="text-destructive text-xs">{errors.slug.message}</p>
        ) : (
          <p className="text-muted-foreground text-xs">
            Lowercase letters, numbers, and hyphens only. Cannot be changed later.
          </p>
        )}
      </div>

      {/* Domain */}
      <div className="space-y-1.5">
        <Label htmlFor="domain">Domain (optional)</Label>
        <Input
          id="domain"
          type="text"
          placeholder="beijing.pandalang.com"
          aria-invalid={!!errors.domain}
          {...register('domain')}
        />
        {errors.domain && (
          <p className="text-destructive text-xs">{errors.domain.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Creating…' : 'Create Tenant'}
        </Button>
      </div>
    </form>
  )
}
