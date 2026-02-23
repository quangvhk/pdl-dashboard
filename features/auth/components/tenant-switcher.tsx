'use client'

import { Building2, Check, ChevronsUpDown, Loader2, ShieldAlert } from 'lucide-react'
import { useAuthStore, selectCurrentTenant } from '@/stores/auth.store'
import { useSwitchTenant } from '@/features/auth/hooks/use-switch-tenant'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

/**
 * TenantSwitcher — dropdown for switching between tenant contexts.
 *
 * - Shows the current tenant name + role badge in the trigger
 * - Lists all tenant memberships; current tenant is highlighted with a checkmark
 * - SUSPENDED tenants are shown but not clickable
 * - Super Admin sees all tenants; non-admins see only their memberships
 * - Hidden when user has no tenants
 */
export function TenantSwitcher() {
  const tenants = useAuthStore((s) => s.tenants)
  const currentTenantId = useAuthStore((s) => s.currentTenantId)
  const currentTenant = useAuthStore(selectCurrentTenant)
  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin ?? false)

  const { mutate: switchTenant, isPending } = useSwitchTenant()

  // Hide when user has no tenants and is not a super admin
  if (tenants.length === 0 && !isSuperAdmin) return null

  const triggerLabel = currentTenant
    ? currentTenant.tenantName
    : isSuperAdmin
      ? 'Super Admin'
      : 'Select Tenant'

  const triggerRole = currentTenant
    ? currentTenant.roleName
    : isSuperAdmin
      ? 'SUPER_ADMIN'
      : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 max-w-[220px] gap-2 px-3"
          disabled={isPending}
          aria-label="Switch tenant"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          ) : (
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate text-sm font-medium">{triggerLabel}</span>
          {triggerRole && (
            <Badge variant="secondary" className="hidden shrink-0 text-[10px] sm:inline-flex">
              {formatRole(triggerRole)}
            </Badge>
          )}
          <ChevronsUpDown className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Your Tenants
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {tenants.length === 0 && (
          <div className="px-2 py-3 text-center text-sm text-muted-foreground">
            No tenant memberships
          </div>
        )}

        {tenants.map((tenant) => {
          const isActive = tenant.tenantId === currentTenantId
          const isSuspended = tenant.status === 'SUSPENDED'

          return (
            <DropdownMenuItem
              key={tenant.tenantId}
              disabled={isSuspended || isPending}
              onClick={() => {
                if (!isActive && !isSuspended) {
                  switchTenant({ tenantId: tenant.tenantId })
                }
              }}
              className={cn(
                'flex items-start gap-2 py-2',
                isSuspended && 'opacity-50 cursor-not-allowed',
              )}
            >
              {/* Active checkmark */}
              <Check
                className={cn(
                  'mt-0.5 h-4 w-4 shrink-0',
                  isActive ? 'text-primary' : 'text-transparent',
                )}
              />

              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-medium">{tenant.tenantName}</span>
                  {isSuspended && (
                    <Badge variant="destructive" className="text-[10px]">
                      Suspended
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground truncate">
                    {tenant.tenantSlug}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    {formatRole(tenant.roleName)}
                  </Badge>
                </div>
              </div>
            </DropdownMenuItem>
          )
        })}

        {/* Super Admin global context indicator */}
        {isSuperAdmin && (
          <>
            <DropdownMenuSeparator />
            <div className="flex items-center gap-2 px-3 py-2">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span className="text-xs text-muted-foreground">
                Super Admin — global access
              </span>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Format a role name for display: TENANT_ADMIN → Tenant Admin */
function formatRole(role: string): string {
  return role
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}
