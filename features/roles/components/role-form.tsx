'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save } from 'lucide-react'
import { useCreateRole } from '../hooks/use-create-role'
import { useUpdateRole } from '../hooks/use-update-role'
import {
  createRoleSchema,
  updateRoleSchema,
  type CreateRoleFormValues,
  type UpdateRoleFormValues,
} from '../schemas/role.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { PlatformRole } from '@/types'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface RoleFormProps {
  /** When provided, the form operates in edit mode for this role. */
  role?: PlatformRole
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function RoleForm({ role }: RoleFormProps) {
  const router = useRouter()
  const isEdit = !!role

  const createMutation = useCreateRole()
  const updateMutation = useUpdateRole()

  const isPending = createMutation.isPending || updateMutation.isPending

  // Use the appropriate schema depending on mode
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleFormValues | UpdateRoleFormValues>({
    resolver: zodResolver(isEdit ? updateRoleSchema : createRoleSchema),
    defaultValues: {
      name: role?.name ?? '',
      description: role?.description ?? '',
    },
  })

  const onSubmit = (data: CreateRoleFormValues | UpdateRoleFormValues) => {
    if (isEdit) {
      updateMutation.mutate(
        { roleId: role.id, data: data as UpdateRoleFormValues },
        { onSuccess: () => router.push('/roles') },
      )
    } else {
      createMutation.mutate(data as CreateRoleFormValues, {
        onSuccess: () => router.push('/roles'),
      })
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Role' : 'Create Role'}</CardTitle>
        <CardDescription>
          {isEdit
            ? 'Update the name or description of this custom role.'
            : 'Define a new platform role. Use uppercase letters, digits, and underscores (e.g. CUSTOM_ROLE).'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. CONTENT_EDITOR"
              autoComplete="off"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Uppercase letters, digits, and underscores only.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this role can do…"
              rows={3}
              aria-invalid={!!errors.description}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isPending
                ? isEdit
                  ? 'Saving…'
                  : 'Creating…'
                : isEdit
                  ? 'Save Changes'
                  : 'Create Role'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
