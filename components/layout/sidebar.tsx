'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  BookOpen,
  GraduationCap,
  Users,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Mail,
  Shield,
  Lock,
  KeyRound,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore, selectCurrentTenant } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  /** Roles that can see this item. Empty array = all authenticated users. */
  roles: string[]
  /** If true, only Super Admin can see this item regardless of currentRole. */
  superAdminOnly?: boolean
}

const navigation: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR', 'STUDENT'],
  },
  {
    label: 'Courses',
    href: '/courses',
    icon: BookOpen,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR', 'STUDENT'],
  },
  {
    label: 'My Enrollments',
    href: '/enrollments',
    icon: GraduationCap,
    roles: ['STUDENT'],
  },
  {
    label: 'Members',
    href: '/members',
    icon: UserCheck,
    roles: ['TENANT_ADMIN', 'SUPER_ADMIN'],
  },
  {
    label: 'Invitations',
    href: '/invitations',
    icon: Mail,
    roles: ['TENANT_ADMIN', 'INSTRUCTOR', 'SUPER_ADMIN'],
  },
  {
    label: 'Users',
    href: '/users',
    icon: Users,
    roles: ['SUPER_ADMIN'],
    superAdminOnly: true,
  },
  {
    label: 'Tenants',
    href: '/tenants',
    icon: Building2,
    roles: ['SUPER_ADMIN'],
    superAdminOnly: true,
  },
  {
    label: 'Roles',
    href: '/roles',
    icon: Shield,
    roles: ['SUPER_ADMIN'],
    superAdminOnly: true,
  },
  {
    label: 'Permissions',
    href: '/permissions',
    icon: Lock,
    roles: ['SUPER_ADMIN'],
    superAdminOnly: true,
  },
  {
    label: 'Role Permissions',
    href: '/role-permissions',
    icon: KeyRound,
    roles: ['TENANT_ADMIN', 'SUPER_ADMIN'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR', 'STUDENT'],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin ?? false)
  const currentRole = useAuthStore((s) => s.currentRole)
  const currentTenantId = useAuthStore((s) => s.currentTenantId)
  const currentTenant = useAuthStore(selectCurrentTenant)
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore()

  const visibleNavItems = navigation.filter((item) => {
    if (item.superAdminOnly) return isSuperAdmin
    if (isSuperAdmin) return true
    if (!currentRole) return false
    return item.roles.includes(currentRole)
  })

  /** Whether the user is authenticated but has no active tenant context */
  const hasNoTenantContext = !isSuperAdmin && !currentTenantId

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'bg-card border-border flex h-full flex-col border-r transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-64',
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex h-16 items-center border-b px-4',
            sidebarCollapsed ? 'justify-center' : 'gap-3',
          )}
        >
          <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm select-none">
            🐼
          </div>
          {!sidebarCollapsed && (
            <span className="text-foreground text-base font-semibold tracking-tight">
              Pandalang
            </span>
          )}
        </div>

        {/* Current tenant context */}
        {!sidebarCollapsed && (
          <div className="border-b px-4 py-3">
            {currentTenant ? (
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium text-foreground truncate">
                  {currentTenant.tenantName}
                </p>
                <div className="flex items-center gap-1.5">
                  <p className="text-[11px] text-muted-foreground truncate">
                    {currentTenant.tenantSlug}
                  </p>
                  {currentRole && (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0 shrink-0">
                      {formatRole(currentRole)}
                    </Badge>
                  )}
                </div>
              </div>
            ) : isSuperAdmin ? (
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium text-foreground">Super Admin</p>
                <p className="text-[11px] text-muted-foreground">Global access</p>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <p className="text-[11px]">No tenant selected</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="flex flex-col gap-1 px-2">
            {/* No-tenant warning for non-super-admins */}
            {hasNoTenantContext && !sidebarCollapsed && (
              <div className="mb-2 rounded-md bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                Select a tenant to access all features.
              </div>
            )}

            {visibleNavItems.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href))

              if (sidebarCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-md transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Collapse toggle */}
        <Separator />
        <div
          className={`flex items-center p-2 ${
            sidebarCollapsed ? 'justify-center' : 'justify-end'
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebarCollapsed}
            className="text-muted-foreground h-8 w-8"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}

/** Format a role name for display: TENANT_ADMIN → Tenant Admin */
function formatRole(role: string): string {
  return role
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}
