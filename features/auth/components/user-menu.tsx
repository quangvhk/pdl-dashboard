'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User, Settings, Building2, ShieldCheck } from 'lucide-react'
import { useAuthStore, selectCurrentTenant, selectIsSuperAdmin } from '@/stores/auth.store'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * UserMenu — avatar dropdown shown in the dashboard header.
 *
 * Displays the current user's name, email, current tenant, and role.
 * Shows a Super Admin badge when applicable.
 * Provides links to Profile / Settings and a logout action.
 */
export function UserMenu() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { mutate: logout, isPending } = useLogout()
  const currentTenant = useAuthStore(selectCurrentTenant)
  const isSuperAdmin = useAuthStore(selectIsSuperAdmin)
  const currentRole = useAuthStore((s) => s.currentRole)

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() ||
      user.email[0].toUpperCase()
    : '?'

  const displayName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email
    : ''

  const formattedRole = currentRole
    ? currentRole.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0"
          aria-label="User menu"
          disabled={isPending}
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1.5">
            {/* Name + Super Admin badge */}
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              {isSuperAdmin && (
                <Badge variant="destructive" className="h-4 px-1 text-[10px] font-semibold">
                  <ShieldCheck className="mr-0.5 h-2.5 w-2.5" />
                  Super Admin
                </Badge>
              )}
            </div>

            {/* Email */}
            <p className="text-muted-foreground text-xs leading-none">{user?.email}</p>

            {/* Current tenant + role */}
            {currentTenant ? (
              <div className="mt-0.5 flex items-center gap-1.5">
                <Building2 className="text-muted-foreground h-3 w-3 shrink-0" />
                <span className="text-muted-foreground truncate text-xs leading-none">
                  {currentTenant.tenantName}
                </span>
                {formattedRole && (
                  <>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className="text-muted-foreground text-xs leading-none">
                      {formattedRole}
                    </span>
                  </>
                )}
              </div>
            ) : isSuperAdmin ? (
              <div className="mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="text-muted-foreground h-3 w-3 shrink-0" />
                <span className="text-muted-foreground text-xs leading-none">Global access</span>
              </div>
            ) : null}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => logout()}
          disabled={isPending}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? 'Signing out…' : 'Log out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
