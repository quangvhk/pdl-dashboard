'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  courses: 'Courses',
  enrollments: 'My Enrollments',
  users: 'Users',
  tenants: 'Tenants',
  settings: 'Settings',
  new: 'New',
  edit: 'Edit',
  sections: 'Sections',
  lessons: 'Lessons',
  quizzes: 'Quizzes',
}

function formatSegment(segment: string): string {
  // Check known labels first
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment]

  // If it looks like an ID (UUID or numeric), show a shortened version
  if (/^[0-9a-f-]{8,}$/i.test(segment)) {
    return segment.slice(0, 8) + '…'
  }

  // Fallback: capitalise and replace hyphens
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Split path into segments, filter empty strings
  const segments = pathname.split('/').filter(Boolean)

  // Build cumulative hrefs
  const crumbs = segments.map((segment, index) => ({
    label: formatSegment(segment),
    href: '/' + segments.slice(0, index + 1).join('/'),
    isLast: index === segments.length - 1,
  }))

  if (crumbs.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground flex items-center transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
          {crumb.isLast ? (
            <span
              className="text-foreground max-w-[160px] truncate font-medium"
              aria-current="page"
            >
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className={cn(
                'text-muted-foreground hover:text-foreground max-w-[120px] truncate transition-colors',
              )}
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
