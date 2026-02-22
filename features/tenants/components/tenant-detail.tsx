'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import {
  Loader2,
  AlertCircle,
  Building2,
  Globe,
  Calendar,
  CheckCircle2,
  PauseCircle,
  FlaskConical,
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTenantSchema, type UpdateTenantFormValues } from '@/features/tenants/schemas/tenant.schema'
import { useTenant } from '@/features/tenants/hooks/use-tenant'
import { tenantsQueryKeys } from '@/features/tenants/hooks/use-tenants'
import { tenantsService } from '@/lib/api/services/tenants.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import type { TenantStatus } from '@/types'

// ─── Constants ─────────────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<TenantStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ACTIVE: 'default',
  TRIAL: 'secondary',
  SUSPENDED: 'destructive',
}

const STATUS_LABEL: Record<TenantStatus, string> = {
  ACTIVE: 'Active',
  TRIAL: 'Trial',
  SUSPENDED: 'Suspended',
}

const STATUS_ICON: Record<TenantStatus, React.ReactNode> = {
  ACTIVE: <CheckCircle2 className="h-4 w-4 text-green-600" />,
  TRIAL: <FlaskConical className="h-4 w-4 text-blue-500" />,
  SUSPENDED: <PauseCircle className="h-4 w-4 text-destructive" />,
}

// ─── Props ──────────────────────────────────────────────────────────────────────

interface TenantDetailProps {
  tenantId: string
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function TenantDetail({ tenantId }: TenantDetailProps) {
  const queryClient = useQueryClient()
  const [updateError, setUpdateError] = useState<string | null>(null)

  const { data: tenant, isLoading, isError } = useTenant(tenantId)

  // Update tenant mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateTenantFormValues) =>
      tenantsService.update(tenantId, {
        name: data.name,
        domain: data.domain || null,
      }),
    onSuccess: (updatedTenant) => {
      queryClient.setQueryData(tenantsQueryKeys.detail(tenantId), updatedTenant)
      queryClient.invalidateQueries({ queryKey: tenantsQueryKeys.lists() })
      setUpdateError(null)
    },
    onError: (err) => {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update tenant.')
    },
  })

  // Update status mutation
  const statusMutation = useMutation({
    mutationFn: (status: TenantStatus) =>
      tenantsService.updateStatus(tenantId, { status }),
    onSuccess: (updatedTenant) => {
      queryClient.setQueryData(tenantsQueryKeys.detail(tenantId), updatedTenant)
      queryClient.invalidateQueries({ queryKey: tenantsQueryKeys.lists() })
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateTenantFormValues, unknown, UpdateTenantFormValues>({
    resolver: zodResolver(updateTenantSchema),
    values: tenant
      ? {
          name: tenant.name,
          domain: tenant.domain ?? '',
        }
      : undefined,
  })

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-muted h-24 animate-pulse rounded-lg" />
        <div className="bg-muted h-64 animate-pulse rounded-lg" />
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (isError || !tenant) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Failed to load tenant. Please try again.
      </div>
    )
  }

  const onSubmit = (data: UpdateTenantFormValues) => {
    updateMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      {/* Tenant overview card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Tenant Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name + status row */}
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold">{tenant.name}</h2>
            <div className="flex items-center gap-1.5">
              {STATUS_ICON[tenant.status]}
              <Badge variant={STATUS_VARIANT[tenant.status]}>
                {STATUS_LABEL[tenant.status]}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Meta grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="text-muted-foreground h-4 w-4 shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Slug</p>
                <code className="bg-muted rounded px-1.5 py-0.5 text-xs">{tenant.slug}</code>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="text-muted-foreground h-4 w-4 shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Domain</p>
                <p className="font-medium">{tenant.domain ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="text-muted-foreground h-4 w-4 shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Created</p>
                <p className="font-medium">{format(new Date(tenant.createdAt), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status actions */}
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-muted-foreground text-sm">Change status:</p>
            {tenant.status !== 'ACTIVE' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={statusMutation.isPending}
                  >
                    {statusMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                    Activate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Activate tenant?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {tenant.name} will be set to Active status. Users will be able to log in and
                      access the platform.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => statusMutation.mutate('ACTIVE')}>
                      Activate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {tenant.status !== 'TRIAL' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={statusMutation.isPending}
                  >
                    {statusMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <FlaskConical className="mr-2 h-4 w-4 text-blue-500" />
                    Set Trial
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Set tenant to Trial?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {tenant.name} will be set to Trial status. Trial tenants have limited access
                      to platform features.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => statusMutation.mutate('TRIAL')}>
                      Set Trial
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {tenant.status !== 'SUSPENDED' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={statusMutation.isPending}
                  >
                    {statusMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <PauseCircle className="mr-2 h-4 w-4" />
                    Suspend
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Suspend tenant?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {tenant.name} will be suspended. All users in this tenant will be unable to
                      log in until the tenant is reactivated.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => statusMutation.mutate('SUSPENDED')}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Suspend
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tenant settings form */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Update error */}
            {updateError && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {updateError}
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-destructive text-xs">{errors.name.message}</p>
              )}
            </div>

            {/* Slug (read-only) */}
            <div className="space-y-1.5">
              <Label htmlFor="slug-readonly">Slug</Label>
              <Input
                id="slug-readonly"
                type="text"
                value={tenant.slug}
                readOnly
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-muted-foreground text-xs">Slug cannot be changed after creation.</p>
            </div>

            {/* Domain */}
            <div className="space-y-1.5">
              <Label htmlFor="domain">Domain</Label>
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
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
