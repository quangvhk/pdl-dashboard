'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Send } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { rolesService } from '@/lib/api/services/roles.service'
import { useAuthStore } from '@/stores/auth.store'
import { useCreateInvitation } from '../hooks/use-create-invitation'
import {
  createInvitationSchema,
  type CreateInvitationFormValues,
} from '../schemas/invitation.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ─── Component ─────────────────────────────────────────────────────────────────

export function CreateInvitationForm() {
  const router = useRouter()
  const currentRole = useAuthStore((s) => s.currentRole)
  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin ?? false)

  const createMutation = useCreateInvitation()

  // Fetch available roles
  const { data: allRoles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles', 'list'],
    queryFn: () => rolesService.list(),
    staleTime: 5 * 60 * 1000,
  })

  // Instructors can only invite students — filter roles accordingly
  const isInstructor = currentRole === 'INSTRUCTOR' && !isSuperAdmin
  const availableRoles = isInstructor
    ? allRoles.filter((r) => r.name === 'STUDENT')
    : allRoles

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateInvitationFormValues>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: {
      email: '',
      roleId: isInstructor && availableRoles.length === 1 ? availableRoles[0].id : '',
    },
  })

  const selectedRoleId = watch('roleId')

  const onSubmit = (data: CreateInvitationFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => router.push('/invitations'),
    })
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Invite a Member</CardTitle>
        <CardDescription>
          Send an invitation email to add a new member to this tenant.
          {isInstructor && (
            <span className="mt-1 block text-xs text-muted-foreground">
              As an Instructor, you can only invite Students.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              autoComplete="off"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Role */}
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
                disabled={isInstructor && availableRoles.length === 1}
              >
                <SelectTrigger id="roleId" aria-invalid={!!errors.roleId}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
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

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || rolesLoading}>
              {createMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {createMutation.isPending ? 'Sending…' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
