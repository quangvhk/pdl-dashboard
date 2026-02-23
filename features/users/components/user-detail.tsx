'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { toast } from 'sonner'
import {
  Loader2,
  AlertCircle,
  UserCircle,
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
  ShieldOff,
  Building2,
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUserSchema, type UpdateUserFormValues } from '@/features/users/schemas/user.schema'
import { useUser } from '@/features/users/hooks/use-user'
import { usersQueryKeys } from '@/features/users/hooks/use-users'
import { usersService } from '@/lib/api/services/users.service'
import { RoleBadge } from './role-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
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

// ─── Component ─────────────────────────────────────────────────────────────────

interface UserDetailProps {
  userId: string
}

export function UserDetail({ userId }: UserDetailProps) {
  const queryClient = useQueryClient()
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
      toast.success('Profile updated', {
        description: `${updatedUser.firstName} ${updatedUser.lastName}'s profile has been saved.`,
      })
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to update profile.'
      setUpdateError(message)
      toast.error('Failed to update profile', { description: message })
    },
  })

  // Deactivate mutation
  const deactivateMutation = useMutation({
    mutationFn: () => usersService.deactivate(userId),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(usersQueryKeys.detail(userId), updatedUser)
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() })
      toast.success('Account deactivated', {
        description: `${updatedUser.firstName} ${updatedUser.lastName} can no longer log in.`,
      })
    },
    onError: (err) => {
      toast.error('Failed to deactivate account', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })

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
                {user.isSuperAdmin && (
                  <Badge variant="destructive" className="text-xs">Super Admin</Badge>
                )}
                {user.tenants.length === 0 && !user.isSuperAdmin && (
                  <span className="text-muted-foreground text-xs">No tenant memberships</span>
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

      {/* Tenant memberships */}
      {user.tenants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Tenant Memberships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.tenants.map((t) => (
                <div key={t.tenantId} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">{t.tenantName}</p>
                    <p className="text-muted-foreground text-xs">{t.tenantSlug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RoleBadge role={t.roleName} />
                    <Badge
                      variant={t.status === 'ACTIVE' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {t.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
