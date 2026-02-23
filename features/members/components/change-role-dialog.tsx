'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { rolesService } from '@/lib/api/services/roles.service'
import { useChangeRole } from '../hooks/use-change-role'
import { changeRoleSchema, type ChangeRoleFormValues } from '../schemas/member.schema'
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
import type { Member } from '@/types'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ChangeRoleDialogProps {
  member: Member
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ChangeRoleDialog({ member, open, onOpenChange }: ChangeRoleDialogProps) {
  const changeRoleMutation = useChangeRole()

  // Fetch available roles
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles', 'list'],
    queryFn: () => rolesService.list(),
    staleTime: 5 * 60 * 1000,
  })

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangeRoleFormValues>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: { roleId: member.roleId },
  })

  // Reset form when member changes
  useEffect(() => {
    reset({ roleId: member.roleId })
  }, [member.roleId, reset])

  const selectedRoleId = watch('roleId')

  const onSubmit = (data: ChangeRoleFormValues) => {
    changeRoleMutation.mutate(
      { memberId: member.id, data },
      {
        onSuccess: () => onOpenChange(false),
      },
    )
  }

  const memberName = member.user
    ? `${member.user.firstName} ${member.user.lastName}`
    : 'this member'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Update the role for {memberName} in this tenant.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="roleId">Role</Label>
            {rolesLoading ? (
              <div className="flex h-10 items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading roles…
              </div>
            ) : (
              <Select
                value={selectedRoleId}
                onValueChange={(val) => setValue('roleId', val, { shouldValidate: true })}
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={changeRoleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={changeRoleMutation.isPending || rolesLoading || selectedRoleId === member.roleId}
            >
              {changeRoleMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {changeRoleMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
