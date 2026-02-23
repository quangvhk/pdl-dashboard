'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save } from 'lucide-react'
import { useCreatePermission } from '../hooks/use-create-permission'
import {
  createPermissionSchema,
  type CreatePermissionFormValues,
} from '../schemas/permission.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// ─── Component ─────────────────────────────────────────────────────────────────

export function PermissionForm() {
  const router = useRouter()
  const createMutation = useCreatePermission()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePermissionFormValues>({
    resolver: zodResolver(createPermissionSchema) as never,
    defaultValues: {
      action: '',
      subject: '',
      conditions: '',
      inverted: false,
      reason: '',
    },
  })

  const inverted = watch('inverted')

  const onSubmit = (data: CreatePermissionFormValues) => {
    // Parse conditions JSON string into object if provided
    const payload = {
      ...data,
      conditions:
        data.conditions && data.conditions.trim() !== ''
          ? (JSON.parse(data.conditions) as object)
          : undefined,
      reason: data.reason && data.reason.trim() !== '' ? data.reason : undefined,
    }
    createMutation.mutate(payload, {
      onSuccess: () => router.push('/permissions'),
    })
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Create Permission</CardTitle>
        <CardDescription>
          Define a new permission in the platform catalog. Permissions are assigned to roles to
          control access to resources.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Action */}
          <div className="space-y-1.5">
            <Label htmlFor="action">
              Action <span className="text-destructive">*</span>
            </Label>
            <Input
              id="action"
              placeholder="e.g. read, create, update, delete, manage"
              autoComplete="off"
              aria-invalid={!!errors.action}
              {...register('action')}
            />
            {errors.action && (
              <p className="text-xs text-destructive">{errors.action.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              The action this permission controls (e.g. <code>read</code>, <code>manage</code>).
            </p>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <Label htmlFor="subject">
              Subject <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="e.g. Course, User, all"
              autoComplete="off"
              aria-invalid={!!errors.subject}
              {...register('subject')}
            />
            {errors.subject && (
              <p className="text-xs text-destructive">{errors.subject.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              The resource this permission applies to (e.g. <code>Course</code>,{' '}
              <code>all</code>).
            </p>
          </div>

          {/* Inverted */}
          <div className="flex items-center justify-between rounded-md border px-4 py-3">
            <div className="space-y-0.5">
              <Label htmlFor="inverted" className="text-sm font-medium">
                Deny rule
              </Label>
              <p className="text-xs text-muted-foreground">
                When enabled, this permission explicitly denies the action instead of allowing it.
              </p>
            </div>
            <Switch
              id="inverted"
              checked={inverted ?? false}
              onCheckedChange={(checked) => setValue('inverted', checked)}
            />
          </div>

          {/* Conditions */}
          <div className="space-y-1.5">
            <Label htmlFor="conditions">Conditions (JSON)</Label>
            <Textarea
              id="conditions"
              placeholder={'e.g. {"tenantId": "${user.tenantId}"}'}
              rows={3}
              aria-invalid={!!errors.conditions}
              {...register('conditions')}
            />
            {errors.conditions && (
              <p className="text-xs text-destructive">{errors.conditions.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Optional CASL conditions object as JSON. Leave blank for unconditional permission.
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              placeholder="e.g. Allows instructors to manage their own courses"
              autoComplete="off"
              aria-invalid={!!errors.reason}
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-xs text-destructive">{errors.reason.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {createMutation.isPending ? 'Creating…' : 'Create Permission'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
