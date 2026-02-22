# Pandalang Frontend — UI Architecture

## 1. Layout System

The app uses Next.js App Router **route groups** to define two distinct layout shells:

```mermaid
graph TD
    A[Root Layout - app/layout.tsx] --> B[Providers + Fonts + Globals]
    B --> C["(auth) Layout Group"]
    B --> D["(dashboard) Layout Group"]

    C --> C1[Centered Card Layout]
    C1 --> C2[/login]
    C1 --> C3[/register]

    D --> D1[Sidebar + Header + Main]
    D1 --> D2[/dashboard]
    D1 --> D3[/courses]
    D1 --> D4[/enrollments]
    D1 --> D5[/users]
    D1 --> D6[/tenants]
    D1 --> D7[/settings]
```

### 1.1 Root Layout

```
┌─────────────────────────────────────────┐
│ <html>                                  │
│   <body>                                │
│     <Providers>                         │
│       <AuthInitializer>                 │
│         <ThemeProvider>                  │
│           <QueryProvider>               │
│             {children}                  │
│             <Toaster />                 │
│           </QueryProvider>              │
│         </ThemeProvider>                │
│       </AuthInitializer>               │
│     </Providers>                        │
│   </body>                               │
│ </html>                                 │
└─────────────────────────────────────────┘
```

### 1.2 Auth Layout — `(auth)/layout.tsx`

Centered card layout for login/register pages. No sidebar, no header.

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│          ┌───────────────────┐          │
│          │   🐼 Pandalang    │          │
│          │                   │          │
│          │   [Login Form]    │          │
│          │                   │          │
│          │   [Submit]        │          │
│          │                   │          │
│          │   Don't have an   │          │
│          │   account? Sign up│          │
│          └───────────────────┘          │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

### 1.3 Dashboard Layout — `(dashboard)/layout.tsx`

Full dashboard layout with collapsible sidebar, top header, and main content area.

```
┌──────────────────────────────────────────────────────┐
│ Header                                    [🔔] [👤]  │
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│  Sidebar   │  Breadcrumbs: Dashboard > Courses       │
│            │                                         │
│  🏠 Home   │  ┌─────────────────────────────────┐    │
│  📚 Courses│  │                                 │    │
│  📝 Enroll │  │     Main Content Area           │    │
│  👥 Users  │  │                                 │    │
│  🏢 Tenants│  │     (page.tsx renders here)     │    │
│  ⚙️ Settings│  │                                 │    │
│            │  └─────────────────────────────────┘    │
│            │                                         │
│  [Collapse]│                                         │
└────────────┴─────────────────────────────────────────┘
```

## 2. Sidebar Navigation

The sidebar renders different navigation items based on the user's role:

| Nav Item | Icon | Route | Roles |
|----------|------|-------|-------|
| Dashboard | Home | `/dashboard` | All |
| Courses | BookOpen | `/courses` | All |
| My Enrollments | GraduationCap | `/enrollments` | Student |
| Users | Users | `/users` | Tenant Admin, Super Admin |
| Tenants | Building | `/tenants` | Super Admin |
| Settings | Settings | `/settings` | All |

```typescript
// components/layout/sidebar.tsx — Navigation config

const navigation = [
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
    icon: Building,
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR', 'STUDENT'],
  },
]
```

## 3. Component Hierarchy

### 3.1 Shared Components

```
components/
├── ui/                          # shadcn/ui primitives
│   ├── button.tsx               # Button with variants: default, destructive, outline, ghost
│   ├── card.tsx                 # Card, CardHeader, CardContent, CardFooter
│   ├── input.tsx                # Text input
│   ├── label.tsx                # Form label
│   ├── dialog.tsx               # Modal dialog
│   ├── dropdown-menu.tsx        # Dropdown menus
│   ├── tabs.tsx                 # Tab navigation
│   ├── table.tsx                # Data table
│   ├── badge.tsx                # Status badges
│   ├── avatar.tsx               # User avatars
│   ├── skeleton.tsx             # Loading skeletons
│   ├── progress.tsx             # Progress bar
│   ├── select.tsx               # Select dropdown
│   ├── textarea.tsx             # Multi-line text input
│   ├── checkbox.tsx             # Checkbox
│   ├── switch.tsx               # Toggle switch
│   ├── separator.tsx            # Visual separator
│   ├── sheet.tsx                # Slide-out panel (mobile nav)
│   ├── scroll-area.tsx          # Scrollable container
│   ├── alert-dialog.tsx         # Confirmation dialog
│   ├── command.tsx              # Command palette / search
│   ├── popover.tsx              # Popover
│   └── radio-group.tsx          # Radio buttons
│
├── layout/                      # Layout components
│   ├── sidebar.tsx              # Collapsible sidebar with role-based nav
│   ├── header.tsx               # Top bar with search, notifications, user menu
│   ├── mobile-nav.tsx           # Sheet-based mobile navigation
│   └── breadcrumbs.tsx          # Auto-generated breadcrumbs from route
│
├── shared/                      # Reusable business components
│   ├── data-table.tsx           # Generic sortable/filterable table
│   ├── pagination.tsx           # Page navigation controls
│   ├── empty-state.tsx          # "No data" placeholder with icon + CTA
│   ├── loading-skeleton.tsx     # Skeleton patterns for cards, tables, forms
│   ├── confirm-dialog.tsx       # "Are you sure?" dialog
│   ├── role-gate.tsx            # Conditional render by role
│   ├── error-boundary.tsx       # Error boundary with retry
│   └── page-header.tsx          # Page title + description + action buttons
│
└── providers/                   # Context providers
    ├── query-provider.tsx       # React Query client provider
    ├── theme-provider.tsx       # next-themes dark mode provider
    ├── auth-initializer.tsx     # Session restoration on load
    └── providers.tsx            # Composed provider tree
```

### 3.2 Feature Components

Each feature module contains components specific to that domain:

```
features/auth/components/
├── login-form.tsx               # Email + password + tenant slug form
├── register-form.tsx            # Registration form with validation
└── user-menu.tsx                # Avatar dropdown: profile, settings, logout

features/courses/components/
├── course-card.tsx              # Course preview card (thumbnail, title, level, progress)
├── course-list.tsx              # Grid of course cards with filters
├── course-detail.tsx            # Full course view with sections accordion
├── course-form.tsx              # Create/edit course form
├── course-builder/
│   ├── section-list.tsx         # Sortable section list with DnD
│   ├── section-form.tsx         # Add/edit section dialog
│   ├── lesson-list.tsx          # Lessons within a section
│   ├── lesson-form.tsx          # Add/edit lesson dialog
│   └── sortable-item.tsx        # DnD wrapper for reorderable items
└── lesson-viewer.tsx            # Lesson content display (text/video/audio)

features/enrollments/components/
├── enrollment-card.tsx          # Enrollment with course info + progress bar
├── enrollment-list.tsx          # Grid of enrollment cards
├── progress-bar.tsx             # Visual progress indicator
└── enroll-button.tsx            # "Enroll Now" button with loading state

features/quizzes/components/
├── quiz-taker.tsx               # Full quiz-taking interface with timer
├── quiz-question.tsx            # Single question renderer (MC, T/F, fill-in)
├── quiz-results.tsx             # Score display after submission
├── quiz-form.tsx                # Create/edit quiz form
└── question-form.tsx            # Add/edit question with answers

features/users/components/
├── user-table.tsx               # Paginated user table with search
├── user-form.tsx                # Create/edit user form
├── user-detail.tsx              # User profile view
└── role-badge.tsx               # Colored badge for role display

features/tenants/components/
├── tenant-table.tsx             # Paginated tenant table
├── tenant-form.tsx              # Create/edit tenant form
└── tenant-detail.tsx            # Tenant settings view
```

## 4. Design System

### 4.1 Color Palette

Using shadcn/ui's CSS variable-based theming with Tailwind v4:

```css
/* app/globals.css */
@import "tailwindcss";

@theme inline {
  /* Light mode */
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0.08 265);        /* Deep indigo */
  --color-primary-foreground: oklch(0.985 0 0);
  --color-secondary: oklch(0.97 0.01 265);
  --color-secondary-foreground: oklch(0.205 0.08 265);
  --color-accent: oklch(0.55 0.18 145);           /* Green for progress */
  --color-destructive: oklch(0.577 0.245 27.325);
  --color-muted: oklch(0.97 0.005 265);
  --color-muted-foreground: oklch(0.556 0.02 265);
  --color-card: oklch(1 0 0);
  --color-border: oklch(0.922 0.01 265);
  --color-ring: oklch(0.205 0.08 265);
  --radius-default: 0.625rem;
}
```

### 4.2 Typography

- **Headings**: Geist Sans (already configured)
- **Body**: Geist Sans
- **Code/Mono**: Geist Mono

### 4.3 Component Variants

Key component variants used throughout the app:

| Component | Variants | Usage |
|-----------|----------|-------|
| **Button** | default, secondary, outline, ghost, destructive, link | Primary actions, secondary actions, icon buttons |
| **Badge** | default, secondary, outline, destructive | Role badges, status indicators, course level |
| **Card** | default, with hover effect | Course cards, enrollment cards, stat cards |
| **Input** | default, with icon, with error | Form fields |

### 4.4 Status Colors

| Status | Color | Usage |
|--------|-------|-------|
| ACTIVE / PUBLISHED | Green badge | Active enrollments, published courses |
| DRAFT | Yellow badge | Draft courses |
| ARCHIVED / DROPPED | Gray badge | Archived courses, dropped enrollments |
| SUSPENDED | Red badge | Suspended tenants |
| TRIAL | Blue badge | Trial tenants |
| COMPLETED | Green with check | Completed enrollments, passed quizzes |
| FAILED | Red with X | Failed quiz attempts |

## 5. Responsive Design

### Breakpoints

Using Tailwind's default breakpoints:

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | Single column, bottom nav or hamburger menu |
| Tablet | 640px - 1024px | Collapsed sidebar, 2-column grid |
| Desktop | > 1024px | Full sidebar, 3-4 column grid |

### Mobile Adaptations

- **Sidebar**: Converts to a `Sheet` (slide-out drawer) on mobile
- **Course grid**: 1 column on mobile, 2 on tablet, 3-4 on desktop
- **Data tables**: Horizontal scroll on mobile, or card view
- **Forms**: Full-width on mobile
- **Course builder**: Simplified layout, stacked sections

## 6. Loading & Error States

### Loading Patterns

| Pattern | Component | Usage |
|---------|-----------|-------|
| **Page skeleton** | `loading.tsx` | Full page loading (Next.js Suspense) |
| **Card skeleton** | `Skeleton` | Course cards, enrollment cards |
| **Table skeleton** | `Skeleton` rows | User table, tenant table |
| **Inline spinner** | `Loader2` icon | Button loading states |
| **Progress bar** | `Progress` | File uploads, quiz timer |

### Error Patterns

| Pattern | Component | Usage |
|---------|-----------|-------|
| **Page error** | `error.tsx` | Unrecoverable page errors |
| **Inline error** | Alert component | Form validation, API errors |
| **Toast** | Sonner toast | Mutation success/failure notifications |
| **Empty state** | `EmptyState` | No courses, no enrollments |
| **404** | `not-found.tsx` | Invalid routes |

## 7. Dark Mode

Using `next-themes` for system-preference-aware dark mode:

```typescript
// components/providers/theme-provider.tsx
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
```

Theme toggle in the header allows switching between light, dark, and system.
