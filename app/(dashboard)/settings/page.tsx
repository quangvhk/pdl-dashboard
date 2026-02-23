'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import { format } from 'date-fns'
import { useMutation } from '@tanstack/react-query'
import {
  Loader2,
  AlertCircle,
  UserCircle,
  Mail,
  Calendar,
  Shield,
  Building2,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
} from 'lucide-react'
import { updateUserSchema, type UpdateUserFormValues } from '@/features/users/schemas/user.schema'
import { usersService } from '@/lib/api/services/users.service'
import { useAuthStore } from '@/stores/auth.store'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

// ─── Role label helper ──────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  TENANT_ADMIN: 'Admin',
  INSTRUCTOR: 'Instructor',
  STUDENT: 'Student',
}

function formatRole(role: string): string {
  return ROLE_LABELS[role] ?? role
}

// ─── Theme option button ────────────────────────────────────────────────────

interface ThemeOptionProps {
  value: string
  label: string
  icon: React.ReactNode
  current: string | undefined
  onClick: (value: string) => void
}

function ThemeOption({ value, label, icon, current, onClick }: ThemeOptionProps) {
  const isActive = current === value
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
        isActive
          ? 'border-primary bg-primary/5 text-primary'
          : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user, setUser } = useAuthStore()
  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin ?? false)
  const currentRole = useAuthStore((s) => s.currentRole)
  const currentTenantId = useAuthStore((s) => s.currentTenantId)
  const tenants = useAuthStore((s) => s.tenants)
  const currentTenant = tenants.find((t) => t.tenantId === currentTenantId)
  const tenantName = currentTenant?.tenantName ?? null
  const { theme, setTheme } = useTheme()
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>('')

  // Profile update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserFormValues) => {
      if (!user) throw new Error('Not authenticated')
      return usersService.update(user.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar || null,
      })
    },
    onSuccess: (updatedUser) => {
      // Sync the auth store user with updated profile fields
      if (user) {
        setUser({
          ...user,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        })
      }
      setAvatarUrl(updatedUser.avatar ?? '')
      setUpdateError(null)
      setUpdateSuccess(true)
      reset({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        avatar: updatedUser.avatar ?? '',
      })
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000)
    },
    onError: (err) => {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update profile.')
      setUpdateSuccess(false)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateUserFormValues, unknown, UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      avatar: '',
    },
  })

  const onSubmit = (data: UpdateUserFormValues) => {
    setUpdateSuccess(false)
    updateMutation.mutate(data)
  }

  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '?'

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your profile and preferences" />

      {/* ── Profile ─────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>Update your display name and avatar URL.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Avatar preview */}
          <div className="mb-6 flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={avatarUrl || undefined}
                alt={user ? `${user.firstName} ${user.lastName}` : 'User'}
              />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
              <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <Mail className="h-3.5 w-3.5" />
                {user?.email ?? '—'}
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Error banner */}
            {updateError && (
              <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg border p-3 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {updateError}
              </div>
            )}

            {/* Success banner */}
            {updateSuccess && (
              <div className="flex items-start gap-2 rounded-lg border border-green-300/50 bg-green-50 p-3 text-sm text-green-700 dark:border-green-700/30 dark:bg-green-950/30 dark:text-green-400">
                Profile updated successfully.
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

            {/* Email — read-only */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email ?? ''}
                readOnly
                disabled
                className="cursor-not-allowed opacity-60"
              />
              <p className="text-muted-foreground text-xs">Email cannot be changed.</p>
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
                  onClick={() =>
                    reset({
                      firstName: user?.firstName ?? '',
                      lastName: user?.lastName ?? '',
                      avatar: '',
                    })
                  }
                  disabled={updateMutation.isPending}
                >
                  Discard
                </Button>
              )}
              <Button type="submit" disabled={!isDirty || updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {updateMutation.isPending ? 'Saving…' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Appearance ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Choose your preferred colour theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <ThemeOption
              value="light"
              label="Light"
              icon={<Sun className="h-5 w-5" />}
              current={theme}
              onClick={setTheme}
            />
            <ThemeOption
              value="dark"
              label="Dark"
              icon={<Moon className="h-5 w-5" />}
              current={theme}
              onClick={setTheme}
            />
            <ThemeOption
              value="system"
              label="System"
              icon={<Monitor className="h-5 w-5" />}
              current={theme}
              onClick={setTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Account ─────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>Read-only account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Role */}
            <div className="flex items-start gap-3">
              <Shield className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-muted-foreground mb-1 text-xs">Current Role</p>
                {isSuperAdmin ? (
                  <Badge variant="destructive" className="flex items-center gap-1 text-xs w-fit">
                    <ShieldCheck className="h-3 w-3" />
                    Super Admin
                  </Badge>
                ) : currentRole ? (
                  <Badge variant="secondary" className="text-xs">
                    {formatRole(currentRole)}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">No tenant selected</span>
                )}
              </div>
            </div>

            {/* Active Tenant */}
            <div className="flex items-start gap-3">
              <Building2 className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-muted-foreground mb-1 text-xs">Active Tenant</p>
                {isSuperAdmin && !tenantName ? (
                  <span className="text-muted-foreground text-sm">Global access</span>
                ) : (
                  <p className="text-sm font-medium">{tenantName ?? '—'}</p>
                )}
              </div>
            </div>

            {/* Member since */}
            <div className="flex items-start gap-3">
              <Calendar className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-muted-foreground mb-1 text-xs">Member Since</p>
                <p className="text-sm font-medium">{format(new Date(), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>

          {/* ── Tenant Memberships ─────────────────────────────────────── */}
          {tenants.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-3">Tenant Memberships</p>
                <div className="space-y-2">
                  {tenants.map((t) => {
                    const isActive = t.tenantId === currentTenantId
                    const isSuspended = t.status === 'SUSPENDED'
                    return (
                      <div
                        key={t.tenantId}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${
                          isActive ? 'border-primary/40 bg-primary/5' : 'border-border'
                        } ${isSuspended ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{t.tenantName}</p>
                            <p className="text-xs text-muted-foreground truncate">@{t.tenantSlug}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <Badge
                            variant={isSuspended ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {formatRole(t.roleName)}
                          </Badge>
                          {isActive && (
                            <Badge variant="outline" className="text-xs text-primary border-primary/40">
                              Active
                            </Badge>
                          )}
                          {isSuspended && (
                            <Badge variant="destructive" className="text-xs">
                              Suspended
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* ── Super Admin note ───────────────────────────────────────── */}
          {isSuperAdmin && (
            <>
              {tenants.length > 0 && <Separator />}
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">Super Admin</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You have platform-wide administrative access across all tenants.
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
