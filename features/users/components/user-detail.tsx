'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import {
  Loader2,
  AlertCircle,
  UserCircle,
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
  ShieldOff,
  Plus,
  X,
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUserSchema, type UpdateUserFormValues } from '@/features/users/schemas/user.schema'
import { useUser } from '@/features/users/hooks/use-user'
import { useAssignRole, useRemoveRole } from '@/features/users/hooks/use-assign-role'
import { usersQueryKeys } from '@/features/users/hooks/use-users'
import { usersService } from '@/lib/api/services/users.service'
import { RoleBadge } from './role-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ─── Constants ─────────────────────────────────────────────────────────────────

const ASSIGNABLE_ROLES = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'INSTRUCTOR', label: 'Instructor' },
  { value: 'TENANT_ADMIN', label: 'Admin' },
]

// ─── Component ─────────────────────────────────────────────────────────────────

interface UserDetailProps {
  userId: string
}

export function UserDetail({ userId }: UserDetailProps) {
  const queryClient = useQueryClient()
  const [assignRoleValue, setAssignRoleValue] = useState('')
  const [updateError, setUpdateError] = useState<string | null>(null)

  const { data: user, isLoading, isError } = useUser(userId)

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserFormValues) =>
      usersService.update(userId, {
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar || null,
      }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(usersQueryKeys.detail(userId), updatedUser)
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() })
      setUpdateError(null)
    },
    onError: (err) => {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update profile.')
    },
  })

  // Deactivate mutation
  const deactivateMutation = useMutation({
    mutationFn: () => usersService.deactivate(userId),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(usersQueryKeys.detail(userId), updatedUser)
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() })
    },
  })

  const { mutate: assignRole, isPending: isAssigning } = useAssignRole(userId)
  const { mutate: removeRole, isPending: isRemoving } = useRemoveRole(userId)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateUserFormValues, unknown, UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    values: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar ?? '',
        }
      : undefined,
  })

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-muted h-32 animate-pulse rounded-lg" />
        <div className="bg-muted h-64 animate-pulse rounded-lg" />
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (isError || !user) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Failed to load user. Please try again.
      </div>
    )
  }

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()

  const handleAssignRole = () => {
    if (!assignRoleValue) return
    assignRole(
      { roleId: assignRoleValue },
      {
        onSuccess: () => setAssignRoleValue(''),
      },
    )
  }

  const onSubmit = (data: UpdateUserFormValues) => {
    updateMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar + meta */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar ?? undefined} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {user.roles.map((role) => (
                  <RoleBadge key={role.id} role={role.name} />
                ))}
                {user.roles.length === 0 && (
                  <span className="text-muted-foreground text-xs">No roles assigned</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Account info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="text-muted-foreground h-4 w-4 shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Joined</p>
                <p className="font-medium">{format(new Date(user.createdAt), 'MMM d, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="text-muted-foreground h-4 w-4 shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Last Login</p>
                <p className="font-medium">
                  {user.lastLoginAt
                    ? format(new Date(user.lastLoginAt), 'MMM d, yyyy')
                    : 'Never'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {user.isActive ? (
                <ShieldCheck className="h-4 w-4 shrink-0 text-green-600" />
              ) : (
                <ShieldOff className="text-muted-foreground h-4 w-4 shrink-0" />
              )}
              <div>
                <p className="text-muted-foreground text-xs">Status</p>
                <p className={`font-medium ${user.isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit profile form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Update error */}
            {updateError && (
              <div className="bg-destructive/10 border-destructive/30 text-destructive flex items-start gap-2 rounded-lg border p-3 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {updateError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  aria-invalid={!!errors.firstName}
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-destructive text-xs">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  aria-invalid={!!errors.lastName}
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-destructive text-xs">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                aria-invalid={!!errors.avatar}
                {...register('avatar')}
              />
              {errors.avatar && (
                <p className="text-destructive text-xs">{errors.avatar.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {isDirty && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={updateMutation.isPending}
                >
                  Discard
                </Button>
              )}
              <Button type="submit" disabled={!isDirty || updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Role management */}
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current roles */}
          <div>
            <p className="text-muted-foreground mb-2 text-sm">Current Roles</p>
            {user.roles.length === 0 ? (
              <p className="text-muted-foreground text-sm">No roles assigned.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <div key={role.id} className="flex items-center gap-1">
                    <RoleBadge role={role.name} />
                    <button
                      type="button"
                      onClick={() => removeRole(role.id)}
                      disabled={isRemoving}
                      className="text-muted-foreground hover:text-destructive ml-0.5 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${role.name} role`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Assign role */}
          <div>
            <p className="text-muted-foreground mb-2 text-sm">Assign Role</p>
            <div className="flex items-center gap-2">
              <Select value={assignRoleValue} onValueChange={setAssignRoleValue}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a role…" />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                size="sm"
                onClick={handleAssignRole}
                disabled={!assignRoleValue || isAssigning}
              >
                {isAssigning ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Assign
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      {user.isActive && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Deactivate Account</p>
                <p className="text-muted-foreground text-sm">
                  The user will no longer be able to log in. This action can be reversed by
                  re-activating the account.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={deactivateMutation.isPending}>
                    {deactivateMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Deactivate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deactivate account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {user.firstName} {user.lastName} will be unable to log in until their account
                      is reactivated. All their data will be preserved.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deactivateMutation.mutate()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Deactivate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
