'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRoles } from '@/features/roles/hooks/use-roles'
import { usePermissions } from '../hooks/use-permissions'
import { useAssignPermission } from '../hooks/use-assign-permission'
import {
  assignPermissionSchema,
  type AssignPermissionFormValues,
} from '../schemas/permission.schema'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface AssignPermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Pre-select a role when opened from a role-scoped view. */
  defaultRoleId?: string
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function AssignPermissionDialog({
  open,
  onOpenChange,
  defaultRoleId,
}: AssignPermissionDialogProps) {
  const assignMutation = useAssignPermission()

  // Fetch available roles and permissions
  const { data: roles = [], isLoading: rolesLoading } = useRoles()
  const { data: permissions = [], isLoading: permissionsLoading } = usePermissions()

  const isLoading = rolesLoading || permissionsLoading

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AssignPermissionFormValues>({
    resolver: zodResolver(assignPermissionSchema),
    defaultValues: {
      roleId: defaultRoleId ?? '',
      permissionId: '',
    },
  })

  // Sync defaultRoleId when it changes
  useEffect(() => {
    if (defaultRoleId) {
      setValue('roleId', defaultRoleId)
    }
  }, [defaultRoleId, setValue])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset({ roleId: defaultRoleId ?? '', permissionId: '' })
    }
  }, [open, defaultRoleId, reset])

  const selectedRoleId = watch('roleId')
  const selectedPermissionId = watch('permissionId')

  const onSubmit = (data: AssignPermissionFormValues) => {
    assignMutation.mutate(data, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Permission</DialogTitle>
          <DialogDescription>
            Assign a permission from the catalog to a role within this tenant.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role select */}
          <div className="space-y-1.5">
            <Label htmlFor="roleId">
              Role <span className="text-destructive">*</span>
            </Label>
            {rolesLoading ? (
              <div className="flex h-10 items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading roles…
              </div>
            ) : (
              <Select
                value={selectedRoleId}
                onValueChange={(val) => setValue('roleId', val, { shouldValidate: true })}
                disabled={!!defaultRoleId}
              >
                <SelectTrigger id="roleId" aria-invalid={!!errors.roleId}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.roleId && (
              <p className="text-xs text-destructive">{errors.roleId.message}</p>
            )}
          </div>

          {/* Permission select */}
          <div className="space-y-1.5">
            <Label htmlFor="permissionId">
              Permission <span className="text-destructive">*</span>
            </Label>
            {permissionsLoading ? (
              <div className="flex h-10 items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading permissions…
              </div>
            ) : (
              <Select
                value={selectedPermissionId}
                onValueChange={(val) => setValue('permissionId', val, { shouldValidate: true })}
              >
                <SelectTrigger id="permissionId" aria-invalid={!!errors.permissionId}>
                  <SelectValue placeholder="Select a permission" />
                </SelectTrigger>
                <SelectContent>
                  {permissions.map((permission) => (
                    <SelectItem key={permission.id} value={permission.id}>
                      <span className="font-mono text-xs">
                        {permission.action}:{permission.subject}
                      </span>
                      {permission.reason && (
                        <span className="ml-2 text-muted-foreground">— {permission.reason}</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.permissionId && (
              <p className="text-xs text-destructive">{errors.permissionId.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={assignMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                assignMutation.isPending ||
                isLoading ||
                !selectedRoleId ||
                !selectedPermissionId
              }
            >
              {assignMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {assignMutation.isPending ? 'Assigning…' : 'Assign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
