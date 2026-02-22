# Pandalang Frontend — Technology Stack

## 1. Core Framework

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| **Next.js** | 16.x | Framework | App Router, React Server Components, Middleware, API Routes |
| **React** | 19.x | UI Library | Already installed, latest with use() hook, Actions, transitions |
| **TypeScript** | 5.x | Language | Type safety, already configured |

## 2. Styling & UI

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| **Tailwind CSS** | 4.x | Utility CSS | Already installed, v4 with CSS-first config |
| **shadcn/ui** | Latest | Component Library | Not a dependency — copies accessible, customizable components into project. Built on Radix UI primitives. Best-in-class for Tailwind projects |
| **Radix UI** | Latest | Headless Primitives | Installed via shadcn/ui — Dialog, Dropdown, Tabs, Toast, etc. |
| **Lucide React** | Latest | Icons | Default icon set for shadcn/ui, tree-shakeable |
| **class-variance-authority** | Latest | Variant Styling | Used by shadcn/ui for component variants |
| **clsx + tailwind-merge** | Latest | Class Merging | Conditional classes without conflicts |

### Why shadcn/ui over alternatives?

| Alternative | Why Not |
|------------|---------|
| **Material UI** | Heavy bundle, opinionated design, hard to customize with Tailwind |
| **Ant Design** | Chinese-origin but heavy, not Tailwind-native, enterprise-focused |
| **Chakra UI** | Good but runtime CSS-in-JS, not Tailwind-native |
| **Headless UI** | Good but fewer components than Radix, less ecosystem |
| **shadcn/ui** ✅ | Copy-paste ownership, Radix primitives, Tailwind-native, fully customizable, huge community |

## 3. Server State Management

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| **TanStack React Query** | 5.x | Server State | Caching, background refetch, optimistic updates, pagination, infinite scroll |
| **@tanstack/react-query-devtools** | 5.x | Dev Tools | Visual cache inspector during development |

### Why React Query?

- **Automatic caching**: Course lists, user data cached and revalidated
- **Background refetch**: Stale data shown instantly, fresh data fetched in background
- **Optimistic updates**: Instant UI feedback for mutations (lesson completion, quiz submission)
- **Pagination support**: Built-in `useInfiniteQuery` for course catalogs
- **Devtools**: Visual cache inspector for debugging
- **Deduplication**: Multiple components requesting same data = single API call
- **Retry logic**: Automatic retry with exponential backoff

### Why not SWR?

React Query has richer mutation support, better devtools, built-in optimistic updates, and more granular cache control — all critical for an EdTech app with complex data relationships.

## 4. Client State Management

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| **Zustand** | 5.x | Client State | Auth state, UI state, tenant context |

### Why Zustand?

- **Minimal boilerplate**: No providers, reducers, or actions — just a hook
- **TypeScript-first**: Excellent type inference
- **Middleware**: `persist` for localStorage, `devtools` for Redux DevTools, `immer` for immutable updates
- **Small bundle**: ~1KB gzipped
- **No context hell**: Direct store subscription, no provider nesting

### What goes in Zustand vs React Query?

| Zustand (Client State) | React Query (Server State) |
|------------------------|---------------------------|
| Auth tokens (in-memory) | User profile data |
| Current tenant context | Course lists |
| UI preferences (sidebar open, theme) | Enrollment data |
| Form draft state | Quiz questions |
| Navigation state | Progress data |

## 5. Forms & Validation

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| **React Hook Form** | 7.x | Form Management | Performant (uncontrolled), minimal re-renders |
| **Zod** | 3.x | Schema Validation | TypeScript-first, composable, matches API DTOs |
| **@hookform/resolvers** | Latest | RHF + Zod Bridge | Connects Zod schemas to React Hook Form |

### Why this combination?

- Zod schemas mirror the backend DTOs exactly (e.g., `RegisterDto`, `CreateCourseDto`)
- React Hook Form avoids re-rendering the entire form on every keystroke
- Shared Zod schemas can validate both client-side and in API route handlers

## 6. HTTP Client

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| **Custom fetch wrapper** | — | API Client | Built on native `fetch`, adds auth headers, token refresh, error handling |

### Why custom fetch over Axios?

- Next.js extends native `fetch` with caching and revalidation
- No extra dependency needed
- Full control over interceptor logic (auth headers, token refresh, tenant header)
- Works in both Server Components and Client Components

## 7. Additional Libraries

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| **date-fns** | 4.x | Date Formatting | Tree-shakeable, lightweight date utilities |
| **nuqs** | 2.x | URL Search Params | Type-safe URL state management for filters/pagination |
| **sonner** | Latest | Toast Notifications | Beautiful toasts, works with shadcn/ui |
| **next-themes** | Latest | Dark Mode | Theme switching with system preference support |
| **@dnd-kit/core** | Latest | Drag and Drop | Accessible DnD for reordering sections/lessons |

## 8. Development Tools

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| **ESLint** | 9.x | Linting | Already configured with next/core-web-vitals |
| **Prettier** | Latest | Formatting | Consistent code style |
| **prettier-plugin-tailwindcss** | Latest | Tailwind Sorting | Auto-sort Tailwind classes |

## 9. Environment Variables

```env
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_DEFAULT_TENANT_SLUG=demo
```

| Variable | Public | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_APP_URL` | Yes | Frontend app URL (for redirects) |
| `NEXT_PUBLIC_DEFAULT_TENANT_SLUG` | Yes | Default tenant for development |

## 10. Package Installation Commands

```bash
# Core dependencies
pnpm add @tanstack/react-query @tanstack/react-query-devtools zustand

# Forms & validation
pnpm add react-hook-form zod @hookform/resolvers

# UI utilities
pnpm add date-fns nuqs sonner next-themes @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# shadcn/ui initialization (run after install)
pnpm dlx shadcn@latest init

# shadcn/ui components (add as needed)
pnpm dlx shadcn@latest add button card input label dialog dropdown-menu tabs toast table badge avatar separator sheet skeleton command popover select textarea checkbox radio-group switch progress alert-dialog scroll-area
```
