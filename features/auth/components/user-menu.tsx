'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User, Settings } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
 * Displays the current user's name, email, and primary role.
 * Provides links to Profile / Settings and a logout action.
 */
export function UserMenu() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { mutate: logout, isPending } = useLogout()

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() ||
      user.email[0].toUpperCase()
    : '?'

  const displayName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email
    : ''

  const primaryRole = user?.roles?.[0] ?? ''

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

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-muted-foreground text-xs leading-none">{user?.email}</p>
            {primaryRole && (
              <p className="text-muted-foreground text-xs leading-none capitalize">
                {primaryRole.replace(/_/g, ' ').toLowerCase()}
              </p>
            )}
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
