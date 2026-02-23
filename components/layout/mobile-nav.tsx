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
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
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
    label: 'Users',
    href: '/users',
    icon: Users,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN'],
  },
  {
    label: 'Tenants',
    href: '/tenants',
    icon: Building2,
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR', 'STUDENT'],
  },
]

export function MobileNav() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin ?? false)
  const currentRole = useAuthStore((s) => s.currentRole)
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  const visibleNavItems = navigation.filter((item) => {
    if (isSuperAdmin) return true
    if (!currentRole) return false
    return item.roles.includes(currentRole)
  })

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-border flex h-16 flex-row items-center justify-between border-b px-4 py-0 space-y-0">
          <SheetTitle asChild>
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm select-none">
                🐼
              </div>
              <span className="text-foreground text-base font-semibold tracking-tight">
                Pandalang
              </span>
            </div>
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground h-8 w-8"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <ScrollArea className="flex-1 py-4">
          <nav className="flex flex-col gap-1 px-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
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
      </SheetContent>
    </Sheet>
  )
}
