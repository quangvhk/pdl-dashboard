# Pandalang — Completed Tasks

## Task 9.1: Error Pages ✅

**Files created:**
- `app/not-found.tsx` — Custom 404 page; full-viewport centered layout; `FileQuestion` icon in muted circle; "404" heading + "Page not found" subheading + descriptive paragraph; two CTA buttons: "Go to Dashboard" (primary, `Home` icon) + "Browse Courses" (outline); no `'use client'` — pure Server Component.
- `app/error.tsx` — Global error boundary; `'use client'` (required by Next.js); accepts `error` (with optional `digest`) and `reset` props; `useEffect` logs error to console; `AlertTriangle` icon in destructive/10 circle; "Something went wrong" heading + descriptive paragraph; optional `error.digest` display for support reference; two CTA buttons: "Try Again" (calls `reset`, `RefreshCw` icon) + "Go to Dashboard" (outline, `Home` icon).
- `app/(dashboard)/loading.tsx` — Dashboard-wide loading skeleton; Server Component; renders `<PageSkeleton />` from `components/shared/loading-skeleton`; shown automatically by Next.js App Router during route segment transitions.

**Notes:**
- `app/not-found.tsx` is a Server Component — no `'use client'` needed; uses `next/link` for navigation.
- `app/error.tsx` must be `'use client'` per Next.js App Router requirements for error boundaries.
- `error.digest` is an optional hash provided by Next.js for server-side errors; displayed as a support reference ID when present.
- `app/(dashboard)/loading.tsx` reuses the existing `PageSkeleton` from `components/shared/loading-skeleton` — no new skeleton needed.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 8.3: Settings Page ✅

**Files created:**
- `app/(dashboard)/settings/page.tsx` — `'use client'` page; reads `user` from `useAuthStore` and `tenantName` from `useTenantStore`; three card sections:
  - **Profile card** — avatar preview (local `avatarUrl` state updated on successful save, since `AuthUser` has no `avatar` field); first name + last name inputs (React Hook Form + `updateUserSchema`); email read-only disabled field with helper note; avatar URL input; `isDirty` guard with Discard button; "Save Profile" submit button with `Loader2` spinner; success banner (auto-clears after 3 s) + error banner; `useMutation` calls `usersService.update(user.id, ...)` and syncs `firstName`/`lastName` back to auth store via `setUser`.
  - **Appearance card** — three `ThemeOption` buttons (Light / Dark / System) using `useTheme` from `next-themes`; active button highlighted with `border-primary bg-primary/5`; icons: `Sun`, `Moon`, `Monitor`.
  - **Account card** — read-only info grid: Role (all roles as `Badge` with `formatRole` label map), Tenant (`tenantName` from tenant store), Member Since (current date formatted with `date-fns`).

**Notes:**
- `AuthUser` type does not include an `avatar` field — avatar preview uses local `avatarUrl` state initialised to `''` and updated from the `User` response returned by `usersService.update`.
- `updateUserSchema` reused from `features/users/schemas/user.schema.ts` — no new schema needed.
- `ThemeOption` is a small inline component (not exported) to keep the file self-contained.
- `Member Since` uses `format(new Date(), 'MMM d, yyyy')` as a placeholder — `AuthUser` does not expose `createdAt`; the real value would require a separate `/auth/me` fetch.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 8.2: Tenant Management ✅

**Files created:**
- `features/tenants/hooks/use-tenants.ts` — `tenantsQueryKeys` factory (`all`, `lists()`, `list(params)`, `details()`, `detail(id)`); `useTenants` query hook wrapping `tenantsService.list`; accepts `search`, `page`, `limit` params; `staleTime` 2 minutes.
- `features/tenants/hooks/use-tenant.ts` — `useTenant` query hook wrapping `tenantsService.getById`; enabled only when `tenantId` is truthy; `staleTime` 2 minutes.
- `features/tenants/hooks/use-create-tenant.ts` — `useCreateTenant` mutation hook; wraps `tenantsService.create`; on success invalidates `tenantsQueryKeys.lists()` and navigates to `/tenants/[id]`.
- `features/tenants/schemas/tenant.schema.ts` — `createTenantSchema` Zod object (name required max 200, slug required max 100 lowercase-alphanumeric-hyphen regex, domain optional); `updateTenantSchema` (name required, domain optional); exports `CreateTenantFormValues` and `UpdateTenantFormValues` inferred types.
- `features/tenants/components/tenant-table.tsx` — `TenantTable` client component; `DataTable<Tenant>` with columns: Name (Building2 icon), Slug (code element), Domain, Status (`Badge` with `STATUS_VARIANT` map: ACTIVE → default, TRIAL → secondary, SUSPENDED → destructive), Created; built-in `searchable` with controlled search + page reset; `Pagination` with last-page heuristic (array length < PAGE_SIZE 20); error banner on fetch failure; `onRowClick` navigates to tenant detail.
- `features/tenants/components/tenant-form.tsx` — `TenantForm` client component; React Hook Form + `createTenantSchema`; fields: name (required), slug (required, Building2 icon prefix, helper text noting immutability), domain (optional); API error banner; "Cancel" + "Create Tenant" buttons; `useCreateTenant` on submit.
- `features/tenants/components/tenant-detail.tsx` — `TenantDetail` client component; fetches tenant via `useTenant`; Tenant Overview card with name, status badge + icon, slug (code), domain, created date meta; status action buttons (Activate / Set Trial / Suspend) — each button hidden when tenant is already in that status, each wrapped in `AlertDialog` confirmation; Suspend uses destructive variant; Tenant Settings card with edit form (React Hook Form + `updateTenantSchema`, slug read-only disabled field, `isDirty` guard, Discard button); loading skeleton + error banner states.
- `app/(dashboard)/tenants/page.tsx` — `'use client'` page; role gate (SUPER_ADMIN only — others see `Lock` icon + "Access Restricted"); `PageHeader` with "+ New Tenant" button; renders `TenantTable`.
- `app/(dashboard)/tenants/new/page.tsx` — `'use client'` page; role gate (SUPER_ADMIN only); `PageHeader` with "Back to Tenants" button; `Card` wrapping `TenantForm` with `onCancel` navigating back to `/tenants`.
- `app/(dashboard)/tenants/[tenantId]/page.tsx` — `'use client'` page; unwraps `params` via React 19 `use(params)`; role gate (SUPER_ADMIN only); `PageHeader` with "Back to Tenants" button; renders `<TenantDetail tenantId={tenantId} />`.

**Notes:**
- `tenantsQueryKeys` follows the same factory pattern as `usersQueryKeys` — `all`, `lists()`, `list(params)`, `details()`, `detail(id)`.
- `AuthUser.roles` is `string[]` (not objects) — role gate uses `roles.includes('SUPER_ADMIN')` directly.
- `TenantDetail` uses `useForm` with `values` (not `defaultValues`) so the form auto-resets when tenant data loads or changes.
- Status mutation uses `tenantsService.updateStatus` (PATCH to `/tenants/:id/status`) — each status transition has its own `AlertDialog` confirmation; the button for the current status is hidden.
- Slug field is rendered as a disabled read-only `Input` in the edit form with a helper note that it cannot be changed after creation.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 8.1: User Management ✅

**Files created:**
- `features/users/hooks/use-users.ts` — `usersQueryKeys` factory (`all`, `lists`, `list(params)`, `details`, `detail(id)`); `useUsers` query hook wrapping `usersService.list`; accepts `search`, `role`, `isActive`, `page`, `limit` params; `staleTime` 2 minutes.
- `features/users/hooks/use-user.ts` — `useUser` query hook wrapping `usersService.getById`; enabled only when `userId` is truthy; `staleTime` 2 minutes.
- `features/users/hooks/use-create-user.ts` — `useCreateUser` mutation hook; wraps `usersService.create`; on success invalidates `usersQueryKeys.lists()` and navigates to `/users/[id]`.
- `features/users/hooks/use-assign-role.ts` — `useAssignRole` mutation hook wrapping `usersService.assignRole`; `useRemoveRole` mutation hook wrapping `usersService.removeRole`; both update detail cache + invalidate lists on success.
- `features/users/schemas/user.schema.ts` — `createUserSchema` Zod object (firstName, lastName, email, password with strength rules); `updateUserSchema` (firstName, lastName, optional avatar URL); exports `CreateUserFormValues` and `UpdateUserFormValues` inferred types.
- `features/users/components/role-badge.tsx` — `RoleBadge` client component; maps role name string to `Badge` variant (`SUPER_ADMIN` → destructive, `TENANT_ADMIN` → default, `INSTRUCTOR` → secondary, `STUDENT` → outline); falls back gracefully for unknown roles.
- `features/users/components/user-table.tsx` — `UserTable` client component; role filter `Select` (All/Super Admin/Admin/Instructor/Student); `DataTable<User>` with columns: User (avatar + name + email link), Roles (RoleBadge list), Status (CheckCircle2/XCircle), Last Login, Joined; built-in `searchable` with controlled search + page reset; `Pagination` with last-page heuristic (array length < PAGE_SIZE 20); error banner on fetch failure; `onRowClick` navigates to user detail.
- `features/users/components/user-form.tsx` — `UserForm` client component; React Hook Form + `createUserSchema`; fields: firstName, lastName, email, password (show/hide toggle); API error banner; "Cancel" + "Create User" buttons; `useCreateUser` on submit.
- `features/users/components/user-detail.tsx` — `UserDetail` client component; fetches user via `useUser`; Profile card with avatar, name, email, roles, joined/last-login/status meta; Edit Profile form (React Hook Form + `updateUserSchema`, `isDirty` guard, Discard button); Role Management card with current roles + remove (X button) + assign role `Select` + Assign button; Danger Zone card with `AlertDialog`-confirmed Deactivate action (hidden when already inactive); loading skeleton + error banner states.
- `app/(dashboard)/users/page.tsx` — `'use client'` page; role gate (TENANT_ADMIN/SUPER_ADMIN only — others see `Lock` icon + "Access Restricted"); `PageHeader` with "+ New User" button; summary badge; renders `UserTable`.
- `app/(dashboard)/users/new/page.tsx` — `'use client'` page; role gate (TENANT_ADMIN/SUPER_ADMIN only); `PageHeader` with "Back to Users" button; `Card` wrapping `UserForm` with `onCancel` navigating back to `/users`.
- `app/(dashboard)/users/[userId]/page.tsx` — `'use client'` page; unwraps `params` via React 19 `use(params)`; role gate (TENANT_ADMIN/SUPER_ADMIN only); `PageHeader` with "Back to Users" button; renders `<UserDetail userId={userId} />`.

**Notes:**
- `usersQueryKeys` follows the same factory pattern as `coursesQueryKeys` — `all`, `lists()`, `list(params)`, `details()`, `detail(id)`.
- `useAssignRole` and `useRemoveRole` accept `userId` at hook call site (not mutation call site) — consistent with `useUpdateCourse` pattern.
- `UserDetail` uses `useForm` with `values` (not `defaultValues`) so the form auto-resets when the user data loads or changes.
- Role assignment uses `roleId` field from `AssignRoleRequest` — the select value is the role name string (e.g. `'INSTRUCTOR'`) which the API accepts as the roleId for named roles.
- Deactivate uses `usersService.deactivate` (DELETE method) — the Danger Zone card is hidden when `user.isActive` is already false.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 7.3: Course Enrollments View (Instructor) ✅

**Files created:**
- `features/enrollments/hooks/use-course-enrollments.ts` — `useCourseEnrollments` query hook; extends `enrollmentsQueryKeys.byCourse(courseId)` with params in the query key; wraps `enrollmentsService.getCourseEnrollments`; accepts `search`, `page`, `limit` params; enabled only when `courseId` is truthy; `staleTime` 2 minutes.
- `app/(dashboard)/courses/[courseId]/enrollments/page.tsx` — `'use client'` page; unwraps `params` via React 19 `use(params)`; role gate (Instructor/Admin/SuperAdmin only — students see `Lock` icon + "Access Restricted" message + "Back to Courses" button); fetches course via `useCourse` for the page title; fetches enrollments via `useCourseEnrollments` with controlled `search` + `page` state; renders 4 stat cards (Total / Active / Completed / Avg Progress) derived from the current page of enrollments; `DataTable<Enrollment>` with columns: Student (name + email), Status (`Badge` with `STATUS_VARIANT` map), Progress (`Progress` bar + percentage), Enrolled date, Completed date; built-in `searchable` with controlled `searchValue`/`onSearchChange` (resets page to 1 on search change); `Pagination` component with last-page heuristic (array length < `PAGE_SIZE` 20); error banner on fetch failure; "Back to Course" link in `PageHeader` actions slot.

**Notes:**
- `useCourseEnrollments` reuses `enrollmentsQueryKeys.byCourse` from `use-enrollments.ts` — no new key factory needed.
- Stat cards (Total, Active, Completed, Avg Progress) are derived client-side from the current page data; they reflect the filtered/paginated subset, not global totals (consistent with the API not returning aggregate counts).
- `DataTableColumn.cell` renders JSX for Student and Progress columns; sortable columns (student, status, enrolledAt, completedAt) use client-side sort built into `DataTable`.
- Pagination uses the same heuristic as the course list page: if `enrollments.length < PAGE_SIZE`, it's the last page.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 7.2: Course Editor Page ✅

**Files created:**
- `features/courses/hooks/use-update-course.ts` — Exports four mutation hooks: `useUpdateCourse` (patches course metadata, updates detail cache + invalidates lists), `usePublishCourse` (calls `coursesService.publish`, updates cache), `useArchiveCourse` (calls `coursesService.archive`, updates cache), `useDeleteCourse` (removes detail cache entry + invalidates lists).
- `features/courses/schemas/section.schema.ts` — `sectionSchema` Zod object; validates `title` (required, max 200 chars), `description` (optional, max 1000 chars); exports `SectionFormValues` inferred type.
- `features/courses/schemas/lesson.schema.ts` — `lessonSchema` Zod object; validates `title` (required, max 200 chars), `contentType` (enum `TEXT`|`VIDEO`|`AUDIO`|`DOCUMENT`), `content` (optional, max 50000 chars), `mediaUrl` (optional valid URL or empty string), `durationMinutes` (optional int 1–600); exports `LessonFormValues` inferred type.
- `features/quizzes/schemas/question.schema.ts` — `answerSchema` (id optional, answer text, isCorrect bool, sortOrder optional); `questionSchema` with `.refine` requiring at least one correct answer for non-fill-in-blank types; `quizSchema` (title, description, passingScore 0–100, timeLimitMinutes nullable); exports `AnswerFormValues`, `QuestionFormValues`, `QuizFormValues` inferred types.
- `features/courses/components/course-builder/sortable-item.tsx` — `SortableItem` client component; wraps `useSortable` from `@dnd-kit/sortable`; renders a `GripVertical` drag handle via `setActivatorNodeRef`; applies `CSS.Transform.toString` + `transition` inline styles; `isDragging` adds `z-50 opacity-80 shadow-lg`; `disabled` prop disables drag and grays handle.
- `features/courses/components/course-builder/section-form.tsx` — `SectionForm` dialog; add/edit mode detected by `section` prop; React Hook Form + `sectionSchema`; `useEffect` populates form on open; `useMutation` calls `sectionsService.create` or `sectionsService.update`; invalidates `sectionsQueryKeys.byCourse(courseId)` on success.
- `features/courses/components/course-builder/lesson-form.tsx` — `LessonForm` dialog; add/edit mode; React Hook Form + `lessonSchema`; `contentType` select controls which secondary field is shown (content textarea for TEXT, mediaUrl input for VIDEO/AUDIO/DOCUMENT); `useMutation` calls `lessonsService.create` or `lessonsService.update`; invalidates `lessonsQueryKeys.bySection(courseId, sectionId)` on success.
- `features/quizzes/components/quiz-form.tsx` — `QuizForm` dialog; add/edit mode; React Hook Form + `quizSchema`; fields: title, description, passingScore, timeLimitMinutes; `useMutation` calls `quizzesService.create(courseId, sectionId, ...)` or `quizzesService.update(quiz.id, ...)`; invalidates `sectionsQueryKeys.byCourse(courseId)` on success.
- `features/quizzes/components/question-form.tsx` — `QuestionForm` dialog; add/edit mode; React Hook Form + `useFieldArray` for dynamic answers; `questionType` select auto-replaces answers array for `TRUE_FALSE` (fixed True/False options) and `FILL_IN_BLANK` (single correct-answer input); `MULTIPLE_CHOICE` allows up to 6 answers with add/remove; correct-answer checkboxes; `useMutation` calls `quizzesService.addQuestion` or `quizzesService.updateQuestion`; invalidates `quizzesQueryKeys.detail(quizId)` on success.
- `features/courses/components/course-builder/lesson-list.tsx` — `LessonList` client component; accepts `courseId`, `sectionId`, `quizzes`; fetches lessons via `useLessons`; renders sortable lesson rows with content-type icon + badge + duration + edit/delete buttons; renders quiz rows with question count badge + add-question/edit/delete buttons; DnD reorder via `@dnd-kit` with optimistic update + `lessonsService.update(sortOrder)`; `LessonForm`, `QuizForm`, `QuestionForm` dialogs wired inline; `AlertDialog` confirmations for delete lesson and delete quiz.
- `features/courses/components/course-builder/section-list.tsx` — `SectionList` client component; accepts `courseId`; fetches sections via `useSections`; renders sortable `SectionItem` rows each with expand/collapse toggle, lesson count badge, edit/delete buttons, and `LessonList` child; DnD reorder with optimistic update + `sectionsService.update(sortOrder)`; `SectionForm` dialog + `AlertDialog` delete confirmation; "Add Section" button at bottom.
- `app/(dashboard)/courses/[courseId]/edit/page.tsx` — `'use client'` page; unwraps `params` via React 19 `use(params)`; role gate (Instructor/Admin/SuperAdmin only — students see `Lock` icon + "Back to Courses"); fetches course via `useCourse`; populates edit form via `useEffect` + `reset`; Course Details card with title/description/level/thumbnail form + "Save Changes" button (disabled when not dirty); status badge + Publish/Archive/Delete action buttons in `PageHeader` actions slot; Delete uses `AlertDialog` confirmation then navigates to `/courses`; `SectionList` below the details card.

**Notes:**
- `useDeleteCourse` mutation accepts `undefined` as `mutationFn` argument (no payload needed); `onSuccess` callback passed at call site to navigate to `/courses`.
- `@dnd-kit/modifiers` is not installed; vertical-axis restriction is omitted (DnD works without it).
- `quizSchema` and `questionSchema` are co-located in `features/quizzes/schemas/question.schema.ts` for cohesion.
- `LessonList` receives `quizzes` as a prop from `SectionItem` — quizzes are fetched as part of the sections list (via `section.quizzes` if populated) or passed empty; quiz CRUD invalidates `sectionsQueryKeys.byCourse` to refresh counts.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 7.1: Create Course Page ✅

**Files created:**
- `features/courses/schemas/course.schema.ts` — `createCourseSchema` Zod object; validates `title` (required, max 200 chars), `description` (optional, max 2000 chars), `level` (enum `BEGINNER`|`INTERMEDIATE`|`ADVANCED`), `thumbnail` (optional valid URL or empty string); exports `CreateCourseFormValues` inferred type.
- `features/courses/hooks/use-create-course.ts` — `useCreateCourse` mutation hook; wraps `coursesService.create`; on success invalidates `coursesQueryKeys.lists()` so the course list refreshes; navigates to `/courses/[id]/edit` so the instructor can immediately add sections and lessons.
- `features/courses/components/course-form.tsx` — `CourseForm` client component; accepts optional `onCancel` callback; React Hook Form + Zod resolver (`createCourseSchema`); fields: title (required), description (optional `Textarea`), level (`Select` with Beginner/Intermediate/Advanced options + descriptions), thumbnail URL (optional, `BookOpen` icon prefix); API error banner with `AlertCircle`; "Cancel" button (shown when `onCancel` provided) + "Create Course" submit button with `Loader2` spinner while pending; `useForm` typed with explicit third generic `CreateCourseFormValues` to satisfy `zodResolver` type constraints.
- `app/(dashboard)/courses/new/page.tsx` — `'use client'` page; reads `user.roles` from `useAuthStore`; role gate — students see an access-restricted state with `Lock` icon and "Back to Courses" button; instructors/admins see `PageHeader` with back button + `Card` wrapping `CourseForm`; on cancel navigates back to `/courses`.

**Notes:**
- `level` field uses `z.enum(...)` without `.default()` to avoid `zodResolver` generic mismatch; the form `defaultValues` sets `level: 'BEGINNER'` instead.
- `useCreateCourse` redirects to `/courses/[id]/edit` on success — the edit page (Task 7.2) handles full course builder functionality.
- Role gate is client-side only (consistent with the rest of the app); middleware handles unauthenticated redirects.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 6.3: My Enrollments Page ✅

**Files created:**
- `features/enrollments/components/enrollment-card.tsx` — `EnrollmentCard` client component; accepts `enrollment`; renders thumbnail with `BookOpen` fallback; level badge overlay using `LEVEL_VARIANT` map; status badge overlay (`ACTIVE` → "In Progress" with `Clock` icon, `COMPLETED` → "Completed" with `CheckCircle2` icon, `DROPPED` → "Dropped" with `BookOpen` icon); enrolled date and completed date rows with icons; `Progress` bar showing `progressPercent`; footer CTA — "Continue Learning" button (primary) for active enrollments, "View Course" button (outline) for completed; `EnrollmentCardSkeleton` matches layout for loading states.
- `features/enrollments/components/enrollment-list.tsx` — `EnrollmentList` client component; accepts `enrollments`, `isLoading`, `onBrowseCourses`; renders `EnrollmentCardSkeleton` grid (3 cards) while loading; renders `EmptyState` with `BookOpen` icon and optional "Browse Courses" CTA when empty; groups enrollments by `status` using `GROUP_CONFIG` (`ACTIVE` → "In Progress" order 0, `COMPLETED` → "Completed" order 1, `DROPPED` → "Dropped" order 2); renders each group as a `<section>` with heading + count pill + responsive 1/2/3-col `EnrollmentCard` grid; groups sorted by defined order so "In Progress" always appears first.
- `app/(dashboard)/enrollments/page.tsx` — `'use client'` page; fetches enrollments via `useMyEnrollments`; derives `active` and `completed` counts for the `PageHeader` description; renders a `GraduationCap` total-count badge in the actions slot; shows an error banner on fetch failure; renders `EnrollmentList` with `onBrowseCourses` navigating to `/courses`.

**Notes:**
- `useMyEnrollments` is already defined in `features/enrollments/hooks/use-enrollments.ts` (Task 5.1) — no new hook needed.
- `EnrollmentList` groups by `EnrollmentStatus` union type; TypeScript ensures exhaustive key handling via the `GROUP_CONFIG` record.
- `EnrollmentCardSkeleton` uses plain `bg-muted` divs (no shadcn `Skeleton` import) to keep the component self-contained.
- "Continue Learning" links to `/courses/[courseId]` (course detail page) — the course detail page handles routing to the last-visited lesson.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 6.2: Quiz Taker ✅

**Files created:**
- `features/quizzes/hooks/use-quiz.ts` — `quizzesQueryKeys` factory (`all`, `detail(id)`, `attempts(id)`); `useQuiz` query hook wrapping `quizzesService.getById`; enabled only when `quizId` is truthy; `staleTime` 2 minutes.
- `features/quizzes/hooks/use-submit-quiz.ts` — `useSubmitQuiz` mutation hook; accepts `{ quizId, data: SubmitQuizRequest }`; wraps `quizzesService.submitAttempt`; invalidates `quizzesQueryKeys.attempts(quizId)` on settle so attempt history stays fresh.
- `features/quizzes/hooks/use-quiz-attempts.ts` — `useQuizAttempts` query hook; wraps `quizzesService.listAttempts`; enabled only when `quizId` is truthy; `staleTime` 1 minute (attempts change after each submission).
- `features/quizzes/schemas/quiz.schema.ts` — `submitAnswerSchema` Zod object (questionId + optional answerId/textAnswer with `.refine` requiring at least one); `submitQuizSchema` (enrollmentId + answers array min 1); exports `SubmitAnswerValues` and `SubmitQuizValues` inferred types.
- `features/quizzes/components/quiz-question.tsx` — `QuizQuestion` client component; accepts `question`, `value`, `onChange`, `index`, `total`; renders `RadioGroup` of answer options for `MULTIPLE_CHOICE`/`TRUE_FALSE` (with hover + checked border highlight via `has-[[data-state=checked]]`); renders plain `Input` for `FILL_IN_BLANK`; shows question text, index/total header, and optional points label.
- `features/quizzes/components/quiz-results.tsx` — `QuizResults` client component; accepts `quiz`, `attempt`, `courseId`, `onRetake`; shows score card with trophy/X icon, percentage display, colour-coded `Progress` bar, pass/fail `Badge`; renders attempt history list (sorted newest-first, latest highlighted) via `useQuizAttempts`; "Back to Course" link + "Try Again" button (shown only on fail); `QuizResultsSkeleton` matches layout.
- `features/quizzes/components/quiz-taker.tsx` — `QuizTaker` client component; accepts `courseId`, `quizId`; fetches quiz via `useQuiz` and enrollment via `useMyEnrollments`; manages per-question answer map in local state; optional countdown timer (`setInterval`) initialised from `quiz.timeLimitMinutes` — auto-submits when time reaches 0, shows red badge when ≤60 s remain; dot-navigation row for jumping between questions; `QuizQuestion` renders current question; Previous/Next buttons; "Submit Quiz" button on last question opens `AlertDialog` confirmation showing answered/unanswered counts with warning for unanswered questions; on confirm calls `useSubmitQuiz` and transitions to `QuizResults`; error banner on submit failure; guards for loading, error, no-enrollment, no-questions states; `QuizTakerSkeleton` matches layout.
- `app/(dashboard)/courses/[courseId]/quizzes/[quizId]/page.tsx` — `'use client'` page; unwraps `params` via React 19 `use(params)`; renders `<QuizTaker courseId={courseId} quizId={quizId} />`.

**Notes:**
- `quizzesQueryKeys` is defined in `use-quiz.ts` and re-exported/imported by `use-submit-quiz.ts` and `use-quiz-attempts.ts` to keep key factories co-located.
- Timer uses `useRef` for the interval handle and clears it on component unmount, on quiz completion, and on retake to prevent memory leaks.
- Dot navigation allows jumping to any question directly; answered dots are highlighted with `bg-primary/20`, current with `bg-primary`.
- `AlertDialogDescription` uses `asChild` with a `<div>` to allow block-level content (unanswered warning paragraph) without hydration errors.
- `QuizResults` shows attempt history only when there are >1 attempts (or while loading), keeping the UI clean for first-time takers.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 6.1: Lesson Viewer ✅

**Files created:**
- `features/courses/hooks/use-lessons.ts` — `useLessons` query hook; `lessonsQueryKeys` factory (`all`, `bySection(courseId, sectionId)`, `detail(courseId, sectionId, lessonId)`); nested under `sectionsQueryKeys.byCourse`; wraps `lessonsService.list`; enabled only when both `courseId` and `sectionId` are truthy; `staleTime` 2 minutes. Also exports `useLesson` for single-lesson fetch via `lessonsService.getById`; enabled only when all three IDs are truthy.
- `features/enrollments/hooks/use-update-progress.ts` — `useUpdateProgress` mutation hook; wraps `enrollmentsService.updateProgress`; accepts `{ enrollmentId, data: UpdateProgressRequest }`; implements optimistic update pattern — cancels in-flight queries, snapshots previous enrollment list, rolls back on error; always invalidates `enrollmentsQueryKeys.mine()` on settle to sync authoritative server state.
- `features/courses/components/lesson-viewer.tsx` — `LessonViewer` client component; accepts `courseId`, `sectionId`, `lessonId`; fetches course, sections, lessons list, single lesson, and enrollments; renders a two-panel layout: collapsible sidebar (`SectionOutline`) with course progress bar + section/lesson tree (each section fetches its lessons via `useLessons`), and main content area with lesson header, scrollable `ContentRenderer`, and footer navigation. `ContentRenderer` handles four content types: `VIDEO` (YouTube/Vimeo embed via iframe, or direct `<video>`), `AUDIO` (`<audio>` player with metadata), `DOCUMENT` (download link), `TEXT` (prose paragraphs). Footer has Previous/Next buttons (cross-section aware), time-spent counter (live `setInterval`), and "Mark Complete" button (calls `useUpdateProgress`, navigates to next lesson/section/course on success). Sidebar hidden on mobile; mobile shows inline progress bar in footer. `LessonViewerSkeleton` matches final layout to prevent shift.
- `app/(dashboard)/courses/[courseId]/sections/[sectionId]/lessons/[lessonId]/page.tsx` — `'use client'` page; unwraps `params` via React 19 `use(params)`; renders `<LessonViewer courseId={courseId} sectionId={sectionId} lessonId={lessonId} />`.

**Notes:**
- `useLessons` is called per-section inside `SectionOutlineItem` so the sidebar lazily loads lesson lists only for expanded sections.
- `useUpdateProgress` uses optimistic update with rollback — the enrollment list is snapshotted before mutation and restored on error; `onSettled` always refetches for authoritative state.
- "Mark Complete" navigates automatically: next lesson in section → first lesson of next section → course detail page (course complete).
- Previous/Next navigation is section-aware: at section boundaries it navigates to the adjacent section's lessons route.
- Time-spent counter resets on `lessonId` change via `useEffect` dependency.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 5.3: Course Detail Page ✅

**Files created:**
- `features/courses/hooks/use-course.ts` — `useCourse` query hook; reuses `coursesQueryKeys.detail(id)` from `use-courses`; wraps `coursesService.getById`; enabled only when `courseId` is truthy; `staleTime` 2 minutes.
- `features/courses/hooks/use-sections.ts` — `useSections` query hook; `sectionsQueryKeys.byCourse(courseId)` nested under `coursesQueryKeys.detail`; wraps `sectionsService.list`; enabled only when `courseId` is truthy; `staleTime` 2 minutes.
- `features/enrollments/hooks/use-enroll.ts` — `useEnroll` mutation hook; wraps `enrollmentsService.create`; on success invalidates `enrollmentsQueryKeys.mine()` so the enrollment list refreshes.
- `features/enrollments/components/enroll-button.tsx` — `EnrollButton` client component; accepts `courseId` and optional `onSuccess` callback; calls `useEnroll` mutation; shows `Loader2` spinner + "Enrolling…" while `isPending`; shows `BookOpen` icon + "Enroll Now" when idle; button disabled while pending.
- `features/courses/components/course-detail.tsx` — `CourseDetail` client component; accepts `courseId`; reads `user.roles` from `useAuthStore`; derives `canEdit` (Instructor/Admin); fetches course via `useCourse`, sections via `useSections`, enrollments via `useMyEnrollments`; derives `enrollment` + `isEnrolled` + `progressPercent` for the current course; renders `CourseDetailSkeleton` while loading; renders error state with "Back to Courses" button on fetch failure; renders: back link, thumbnail (with `BookOpen` fallback), title, level/status/sections/lessons badges, description, CTA block (Edit button for instructors/admins, progress card + "Continue Learning" for enrolled students, `EnrollButton` for unenrolled students); collapsible section accordion (`SectionItem`) with lesson count, lesson rows (linked for enrolled users), quiz rows with `ClipboardList` icon; empty content state when no sections.
- `app/(dashboard)/courses/[courseId]/page.tsx` — `'use client'` page; unwraps `params` via React 19 `use(params)`; renders `<CourseDetail courseId={courseId} />`.

**Notes:**
- `SectionItem` accordion is client-side only (no extra API call per section); lesson rows are rendered as count-based placeholders linking to the lesson viewer route; actual lesson metadata is loaded in the lesson viewer (Task 6.1).
- `canEdit` flag shows "Edit Course" button for Instructor/Admin; students see Enroll or Continue Learning.
- Progress card shows `Progress` bar + percentage derived from `enrollment.progressPercent`.
- `EnrollButton.onSuccess` calls `router.refresh()` to re-fetch enrollment state after enrollment.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 5.2: Course List Page ✅

**Files created/updated:**
- `features/courses/components/course-list.tsx` — `CourseList` client component; accepts `courses`, `isLoading`, `showStatus`, `emptyTitle`, `emptyDescription`, `onEmptyAction`, `emptyActionLabel`; renders `CardGridSkeleton` (count 6) while loading; renders `EmptyState` with `BookOpen` icon when empty (optional CTA via `onEmptyAction`); renders responsive 1/2/3-col `CourseCard` grid when data is present.
- `app/(dashboard)/courses/page.tsx` — `'use client'` courses list page; reads `user.roles` from `useAuthStore`; derives `isInstructor`, `isAdmin`, `isStudent`, `canCreate`, `showStatus` flags; URL state via `nuqs` (`useQueryState`) for `search` (string), `level` (string, default `'ALL'`), `status` (string, default `'ALL'`), `page` (integer, default 1); builds `queryParams` for `useCourses` — students always receive `status: 'PUBLISHED'`, others use the filter; renders `PageHeader` with "+ New Course" button (role-gated to Instructor/Admin); search `Input` with `Search` icon; `Select` for level filter (All/Beginner/Intermediate/Advanced); `Select` for status filter (hidden for students); `CourseList` with context-aware empty state messages; `Pagination` component with last-page heuristic (array length < PAGE_SIZE); all filter changes reset `page` to 1.
- `components/providers/providers.tsx` — Updated to wrap the entire provider tree with `NuqsAdapter` from `'nuqs/adapters/next/app'` (required for `useQueryState` in Next.js App Router).

**Notes:**
- `nuqs` v2 requires `NuqsAdapter` in the provider tree; added as the outermost wrapper in `Providers`.
- Pagination uses a heuristic: if the returned array length is less than `PAGE_SIZE` (9), it's the last page; `totalPages` is set to `page` (last) or `page + 1` (more pages exist). This avoids needing a `PaginatedResponse` wrapper from the API.
- Students see only `PUBLISHED` courses regardless of the status filter (filter UI hidden for students).
- `showStatus` badge on `CourseCard` is enabled for Instructor and Admin roles.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 5.1: Dashboard Page ✅

**Files created:**
- `features/courses/components/course-card.tsx` — `CourseCard` client component; accepts `course`, optional `progressPercent` (renders `Progress` bar in `CardFooter`), `showStatus` (status badge overlay for instructors/admins), `enrolledCount`; thumbnail with `BookOpen` fallback icon; level badge overlay (`BEGINNER`/`INTERMEDIATE`/`ADVANCED` with colour variants); meta row with sections count, lessons count, enrolled count; hover shadow + scale thumbnail transition; full `Link` wrapper to `/courses/[id]`; focus-visible ring for accessibility.
- `features/courses/hooks/use-courses.ts` — `useCourses` query hook; `coursesQueryKeys` factory (`all`, `lists`, `list(params)`, `details`, `detail(id)`); wraps `coursesService.list`; accepts `UseCoursesParams` (pagination + search/status/level filters); `staleTime` 2 minutes.
- `features/enrollments/hooks/use-enrollments.ts` — `useMyEnrollments` query hook; `enrollmentsQueryKeys` factory (`all`, `mine`, `detail(id)`, `byCourse(courseId)`); wraps `enrollmentsService.getMyEnrollments`; only enabled when `isAuthenticated` is true; `staleTime` 2 minutes.
- `app/(dashboard)/dashboard/page.tsx` — `'use client'` page; reads `user.roles` from `useAuthStore`; renders one of four role-specific sub-components: `StudentDashboard`, `InstructorDashboard`, `TenantAdminDashboard`, `SuperAdminDashboard`; role priority: `SUPER_ADMIN` → `TENANT_ADMIN` → `INSTRUCTOR` → `STUDENT` (default).

**Role-specific dashboard content:**
- **Student** (`StudentDashboard`): welcome greeting; 3 stat cards (Enrolled / In Progress / Completed) derived from `useMyEnrollments`; "Continue Learning" list of up to 3 active enrollments with `Progress` bar + "Continue →" link; empty state with "Browse Courses" CTA; "Browse Courses →" footer link.
- **Instructor** (`InstructorDashboard`): welcome greeting; 3 stat cards (My Courses / Published / Drafts) from `useCourses`; `CourseCard` grid (up to 4, `showStatus`); empty state with "Create Course" CTA; "+ Create New Course" button in section header; "View All Courses →" link when >4 courses.
- **Tenant Admin** (`TenantAdminDashboard`): org name heading; 3 stat cards (Users placeholder / Courses / Published); Quick Actions card with "Manage Users", "View Courses", "New Course" buttons; recent courses grid (up to 3, `showStatus`).
- **Super Admin** (`SuperAdminDashboard`): platform heading; 2 stat cards (Tenants / Total Users — both placeholder); Quick Actions card with "Manage Tenants" + "New Tenant" buttons; tenant status info card linking to `/tenants`.

**Shared sub-components (defined in page file):**
- `StatCard` — icon + label + value + optional description; `bg-primary/10` icon container.
- `StatCardSkeleton` — skeleton placeholder matching `StatCard` layout.

**Notes:**
- All four sub-components are `'use client'` (page is `'use client'`).
- Loading states use `Skeleton` components matching the final layout to prevent layout shift.
- `useCourses` and `useMyEnrollments` are only called in the relevant role sub-component — no unnecessary API calls for other roles.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 4.3: Auth Components & Pages ✅

**Files created/updated:**
- `features/auth/components/login-form.tsx` — `LoginForm` client component; React Hook Form + Zod resolver (`loginSchema`); fields: email, password (show/hide toggle), tenantSlug (pre-filled from `NEXT_PUBLIC_DEFAULT_TENANT_SLUG`); inline field validation errors; API error banner with `AlertCircle` icon; calls `useLogin(callbackUrl)` on submit; `callbackUrl` read from `useSearchParams`; redirects to `/dashboard` or `callbackUrl` on success; link to `/register`.
- `features/auth/components/register-form.tsx` — `RegisterForm` client component; React Hook Form + Zod resolver (`registerSchema`); fields: firstName, lastName, email, password (show/hide toggle), tenantSlug; live password strength indicator — 4 rule checklist (length, uppercase, lowercase, digit) with `Check`/`X` icons + 4-segment colour bar (red → yellow → green); inline validation errors; API error banner; calls `useRegister` on submit; link to `/login`.
- `features/auth/components/user-menu.tsx` — `UserMenu` client component; avatar `DropdownMenu` showing display name, email, primary role (formatted); Profile / Settings links navigate to `/settings`; logout action calls `useLogout` mutation; button and logout item disabled while `isPending`; shows "Signing out…" text during logout.
- `app/(auth)/login/page.tsx` — Server component; renders `<LoginForm />` wrapped in `<Suspense>` (required for `useSearchParams`); exports `metadata` with `title: 'Sign In'`.
- `app/(auth)/register/page.tsx` — Server component; renders `<RegisterForm />`; exports `metadata` with `title: 'Create Account'`.
- `features/auth/hooks/use-login.ts` — Updated to accept optional `callbackUrl` param (default `'/dashboard'`) so `LoginForm` can honour the `callbackUrl` query string after middleware redirect.

**Notes:**
- `LoginForm` and `RegisterForm` are `'use client'` — safe to import from any Server or Client component.
- `LoginForm` is wrapped in `<Suspense>` in the page because `useSearchParams()` requires a Suspense boundary in Next.js App Router.
- No `@/components/ui/alert` component exists in the project; error banners use a plain `div` with `bg-destructive/10` + `border-destructive/30` Tailwind classes.
- Password strength bar colours: 1 rule = red, 2–3 rules = yellow, 4 rules = green.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 4.2: Auth Hooks ✅

**Files created:**
- `features/auth/hooks/use-login.ts` — `useLogin` mutation hook; wraps `authService.login`; on success calls `login()` on auth store (stores tokens + user + sets `auth-status` cookie), calls `setTenant()` on tenant store with `tenantId` from response, then redirects to `/dashboard` via `useRouter`.
- `features/auth/hooks/use-register.ts` — `useRegister` mutation hook; wraps `authService.register`; on success calls `login()` on auth store, calls `setTenant()` on tenant store, then redirects to `/dashboard`.
- `features/auth/hooks/use-logout.ts` — `useLogout` mutation hook; wraps `authService.logout`; uses `onSettled` (fires on both success and error) to always: call `logout()` on auth store (clears tokens + cookie), call `clearTenant()` on tenant store, call `queryClient.clear()` to wipe all React Query cache, then redirect to `/login`.
- `features/auth/hooks/use-current-user.ts` — `useCurrentUser` query hook; wraps `authService.getMe`; exports stable `currentUserQueryKey = ['auth', 'me']`; only enabled when `isAuthenticated` is true; `staleTime` 5 minutes; calls `setUser()` on auth store inside `queryFn` to keep Zustand in sync with latest server profile.

**Notes:**
- All hooks are `'use client'` — safe to use in any Client Component.
- `useLogout` uses `onSettled` instead of `onSuccess` so local state is always cleared even if the server logout endpoint fails (e.g. expired token).
- `useCurrentUser` keeps the Zustand `user` field in sync by calling `setUser` inside `queryFn` after each successful fetch.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 4.1: Auth Schemas ✅

**Files created:**
- `features/auth/schemas/login.schema.ts` — `loginSchema` Zod object; validates `email` (required + valid email format), `password` (min 1 char), `tenantSlug` (min 1 char); exports `LoginFormValues` inferred type.
- `features/auth/schemas/register.schema.ts` — `registerSchema` Zod object; validates `firstName` (min 1), `lastName` (min 1), `email` (required + valid email), `password` (min 8 chars + uppercase + lowercase + digit regex rules), `tenantSlug` (min 1); exports `RegisterFormValues` inferred type.

**Notes:**
- Both schemas use `zod` v4 imported from `'zod'`.
- Password strength rules on `registerSchema`: min 8 chars, at least one uppercase letter (`/[A-Z]/`), one lowercase letter (`/[a-z]/`), one digit (`/[0-9]/`).
- Inferred form value types (`LoginFormValues`, `RegisterFormValues`) exported for use with `react-hook-form` + `@hookform/resolvers/zod`.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 3.3: Shared Components ✅

**Files created:**
- `components/shared/page-header.tsx` — `PageHeader` client component; accepts `title`, `description`, `actions` (ReactNode), `className`; responsive flex row on `sm+` with truncated title and shrink-free actions slot.
- `components/shared/empty-state.tsx` — `EmptyState` client component; accepts `icon` (LucideIcon), `title`, `description`, `action` (label + onClick), `children`; renders dashed-border rounded container with muted icon circle, heading, description, and optional CTA `Button`.
- `components/shared/loading-skeleton.tsx` — Exports five skeleton patterns: `CardGridSkeleton` (responsive 1/2/3-col card grid), `TableSkeleton` (header + configurable rows/columns), `StatCardSkeleton` (1/2/4-col stat cards), `PageSkeleton` (header + card grid), `DetailPageSkeleton` (title + body lines + badges); all built from shadcn `Skeleton` + `Card` primitives.
- `components/shared/confirm-dialog.tsx` — `ConfirmDialog` client component wrapping `AlertDialog`; props: `open`, `onOpenChange`, `title`, `description`, `confirmLabel`, `cancelLabel`, `variant` (`default` | `destructive`), `onConfirm`, `isLoading`; disables both buttons while loading; applies `buttonVariants` to the confirm action.
- `components/shared/role-gate.tsx` — `RoleGate` client component; reads `user.roles` from `useAuthStore`; accepts `allowedRoles: Role[]` and optional `fallback`; renders `children` when user has at least one matching role, `fallback` (or nothing) otherwise.
- `components/shared/data-table.tsx` — Generic `DataTable<TRow>` client component; column definitions via `DataTableColumn<TRow>` interface (`key`, `header`, `cell`, `sortable`, `className`); built-in client-side sort (asc/desc/none toggle with `ChevronUp`/`ChevronDown`/`ChevronsUpDown` icons); optional built-in search input with `Search` icon; supports controlled `searchValue`/`onSearchChange` for server-side search; `toolbar` slot for extra controls; shows `TableSkeleton` while `isLoading`, `EmptyState` when no rows; clickable rows via `onRowClick`.
- `components/shared/pagination.tsx` — `Pagination` client component; props: `page` (1-based), `totalPages`, `onPageChange`, optional `totalItems`/`pageSize` for range label; renders "Showing X–Y of Z" or "Page X of Y"; smart page-number list (first, last, current±1, ellipsis); First/Prev/Next/Last icon buttons (`ChevronsLeft`/`ChevronLeft`/`ChevronRight`/`ChevronsRight`); returns `null` when `totalPages <= 1`; full `aria-label` + `aria-current` accessibility.

**Notes:**
- All components are `'use client'` — safe to import from any Server or Client component.
- `DataTable` imports `TableSkeleton` and `EmptyState` internally — no extra wiring needed at call sites.
- `RoleGate` uses the same `Role` union (`SUPER_ADMIN` | `TENANT_ADMIN` | `INSTRUCTOR` | `STUDENT`) as the sidebar navigation config.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 3.2: Dashboard Layout ✅

**Files created:**
- `components/ui/tooltip.tsx` — Tooltip primitive built from `radix-ui` `Tooltip` namespace; exports `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent` with arrow; matches shadcn/ui New York style.
- `components/layout/sidebar.tsx` — `Sidebar` client component; reads `user.roles` from auth store and `sidebarCollapsed` from UI store; filters `navigation` array by role; renders full-width nav links when expanded, icon-only links with `TooltipContent` side labels when collapsed; collapse/expand toggle button at bottom; `w-64` expanded / `w-16` collapsed with `transition-all duration-300`; uses `ScrollArea` for nav overflow.
- `components/layout/header.tsx` — `Header` client component; mobile hamburger (`Menu` icon) calls `toggleSidebar`; renders `<Breadcrumbs />`; theme toggle `DropdownMenu` (Light / Dark / System via `next-themes` `setTheme`); user avatar `DropdownMenu` showing display name, email, role; Profile / Settings links; Log out action calls `logout()` + `router.push('/login')`.
- `components/layout/breadcrumbs.tsx` — `Breadcrumbs` client component; splits `usePathname()` into segments; maps each segment to a human-readable label via `SEGMENT_LABELS` lookup (falls back to capitalised slug or shortened UUID); renders `Home` icon → chevron-separated links → bold current page; last segment uses `aria-current="page"`.
- `components/layout/mobile-nav.tsx` — `MobileNav` client component; `Sheet` (slide-out drawer, `side="left"`) controlled by `sidebarOpen` / `setSidebarOpen` from UI store; same role-filtered `navigation` array as sidebar; each link closes the sheet on click; `X` close button in sheet header.
- `app/(dashboard)/layout.tsx` — Dashboard route-group layout; `flex h-svh overflow-hidden` root; desktop `<Sidebar />` hidden on mobile (`hidden lg:flex`); `<MobileNav />` always mounted (Sheet handles visibility); `<Header />` + scrollable `<main>` with `container mx-auto p-6`; exports `metadata` with `title.template`.

**Notes:**
- `tooltip.tsx` was created manually (shadcn CLI pnpm install failed in workspace); uses same `radix-ui` named-export pattern as other shadcn components.
- Sidebar collapse state persists to `localStorage` via `useUIStore` (Task 2.4).
- Mobile nav open/close state is driven by `useUIStore.sidebarOpen`; the desktop hamburger in `Header` calls `toggleSidebar` which opens the `MobileNav` Sheet on mobile.
- Role filtering uses `user.roles` array — all roles visible to `SUPER_ADMIN`, `TENANT_ADMIN`, `INSTRUCTOR`, `STUDENT` as per spec.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 3.1: Auth Layout ✅

**Files created:**
- `app/(auth)/layout.tsx` — Auth route-group layout; full-viewport centered flex column (`min-h-svh`, `bg-muted/40`); constrains content to `max-w-sm`; renders Pandalang 🐼 logo icon (rounded `bg-primary` tile) + "Pandalang" wordmark above `{children}`; no sidebar, no header; exports `metadata` with `title.template` for auth pages.

**Notes:**
- Uses Next.js App Router route group `(auth)` — does not affect URL paths.
- Branding block is purely presentational (emoji + text); no extra image assets required.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 2.6: Next.js Middleware ✅

**Files created:**
- `middleware.ts` — Next.js Edge middleware at project root; defines `PUBLIC_ROUTES` (`/login`, `/register`); reads `auth-status` cookie to determine `isAuthenticated`; redirects authenticated users away from public routes to `/dashboard`; redirects unauthenticated users from all other routes to `/login` with `callbackUrl` query param; `config.matcher` excludes `api`, `_next/static`, `_next/image`, `favicon.ico`, and any path containing a file extension.

**Notes:**
- Role-based access control is enforced client-side via a `RoleGate` component (Task 3.3) — middleware only checks the lightweight `auth-status` cookie, never decodes JWTs.
- `callbackUrl` is appended to the login redirect so the user is returned to the originally requested page after authentication.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 2.5: Auth Initializer ✅

**Files created/updated:**
- `components/providers/auth-initializer.tsx` — `AuthInitializer` client component; on mount checks persisted `refreshToken` from auth store; if present, calls `authService.refresh()` to silently restore tokens via `setTokens`, then calls `authService.getMe()` to restore user via `setUser`; on any failure calls `logout()` to clear state and cookie; always calls `setInitialized(true)` in `finally`; renders a full-page centered spinner (`animate-spin` div) while `isInitialized` is `false`; renders `children` once initialized.
- `components/providers/providers.tsx` — Updated to wrap `ThemeProvider` children with `<AuthInitializer>`, placing it inside `QueryProvider` so React Query is available for any future query-based initialization.

**Notes:**
- `AuthInitializer` is a `'use client'` component; the `useEffect` dependency array is intentionally empty (runs once on mount) with `eslint-disable-line react-hooks/exhaustive-deps`.
- Loading spinner uses Tailwind `animate-spin` + `border-primary` / `border-t-transparent` pattern — no extra dependency needed.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 2.4: Zustand Stores ✅

**Files updated:**
- `stores/auth.store.ts` — `useAuthStore` with state: `accessToken`, `refreshToken`, `user`, `isInitialized`; computed `isAuthenticated` getter; actions: `login` (stores tokens + user + sets `auth-status` cookie), `setTokens`, `setUser`, `logout` (clears state + cookie), `setInitialized`; persists `refreshToken` and `user` to `sessionStorage` via `pandalang-auth` key; `accessToken` stays in memory only (not persisted).
- `stores/tenant.store.ts` — `useTenantStore` with state: `tenantId`, `tenantSlug`, `tenantName`; actions: `setTenant`, `clearTenant`; persists all fields to `sessionStorage` via `pandalang-tenant` key.
- `stores/ui.store.ts` — `useUIStore` with state: `sidebarOpen` (default `true`), `sidebarCollapsed` (default `false`); actions: `toggleSidebar`, `setSidebarOpen`, `toggleSidebarCollapsed`; persists to `localStorage` via `pandalang-ui` key.

**Notes:**
- All stores use `zustand/middleware` `persist` + `createJSONStorage`.
- `login` and `logout` in auth store guard `document.cookie` access with `typeof document !== 'undefined'` for SSR safety.
- `partialize` on auth store ensures only `refreshToken` + `user` are written to `sessionStorage`; `accessToken` is never persisted.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 2.3: API Service Functions ✅

**Files created:**
- `lib/api/services/auth.service.ts` — `authService` with `login`, `register`, `refresh`, `logout`, `getMe`; all methods fully typed against `@/types` auth types.
- `lib/api/services/tenants.service.ts` — `tenantsService` with `list`, `getById`, `create`, `update`, `updateStatus`; supports `PaginationParams & { search? }` on list.
- `lib/api/services/users.service.ts` — `usersService` with `list`, `getById`, `create`, `update`, `deactivate`, `assignRole`, `removeRole`; list supports `search`, `role`, `isActive` filters.
- `lib/api/services/courses.service.ts` — `coursesService` with `list`, `getById`, `create`, `update`, `delete`, `publish`, `archive`; list supports `search`, `status`, `level` filters.
- `lib/api/services/sections.service.ts` — `sectionsService` with `list`, `create`, `update`, `delete`; all methods take `courseId` as first param.
- `lib/api/services/lessons.service.ts` — `lessonsService` with `list`, `getById`, `create`, `update`, `delete`; all methods take `courseId` + `sectionId` as first params.
- `lib/api/services/quizzes.service.ts` — `quizzesService` with `create`, `getById`, `update`, `delete`, `addQuestion`, `updateQuestion`, `deleteQuestion`, `submitAttempt`, `listAttempts`.
- `lib/api/services/enrollments.service.ts` — `enrollmentsService` with `create`, `getMyEnrollments`, `getById`, `updateProgress`, `getCourseEnrollments`; `getCourseEnrollments` uses `ENDPOINTS.courses.enrollments(courseId)`.

**Notes:**
- All services import `apiClient` from `../client` and `ENDPOINTS` from `../endpoints`.
- All request/response types imported from `@/types` barrel export.
- Query params passed as `Record<string, string | number | boolean | undefined | null>` to match `apiClient.get()` signature.
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0).

---

## Task 2.2: API Client ✅

**Files updated:**
- `lib/api/client.ts` — Full `ApiClient` class with `get`, `post`, `patch`, `put`, `delete` methods; auto-injects `Authorization: Bearer <token>` from auth store; auto-injects `x-tenant-id` header from tenant store; handles 401 with single automatic token refresh via `/api/v1/auth/refresh`; `buildUrl` helper appends query params; `handleResponse` unwraps API envelope (`data.data`) and normalises errors; `ApiError` custom error class with `status`, `code`, `details`; exports singleton `apiClient` instance.
- `lib/api/endpoints.ts` — All API endpoint constants in `ENDPOINTS` object organised by feature: `auth`, `tenants`, `users`, `courses`, `sections`, `lessons`, `quizzes`, `enrollments`, `health`. Static paths as string literals; dynamic paths as typed functions `(id: string) => string`.

**Notes:**
- Store access uses lazy `require()` inside getter functions to avoid circular dependency issues while `stores/auth.store.ts` and `stores/tenant.store.ts` are still placeholders (Task 2.4); falls back gracefully to `null` when stores are not yet initialised.
- `onTokenRefresh` calls the refresh endpoint directly with `fetch` (no `apiClient`) to prevent infinite recursion.
- `onAuthError` calls `logout()` on the auth store and redirects to `/login` (guarded by `typeof window !== 'undefined'` for SSR safety).
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0)

---

## Task 2.1: TypeScript Types ✅

**Files updated:**
- `types/api.ts` — `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiErrorResponse`, `PaginationParams`
- `types/auth.ts` — `AuthUser`, `AuthResponse`, `TokensResponse`, `LoginRequest`, `RegisterRequest`
- `types/tenant.ts` — `Tenant`, `TenantStatus`, `CreateTenantRequest`, `UpdateTenantRequest`, `UpdateTenantStatusRequest`
- `types/user.ts` — `User`, `Role`, `CreateUserRequest`, `UpdateUserRequest`, `AssignRoleRequest`
- `types/course.ts` — `Course`, `Section`, `Lesson`, `CourseLevel`, `CourseStatus`, `ContentType`, all create/update request types
- `types/enrollment.ts` — `Enrollment`, `EnrollmentStatus`, `EnrollmentCourse`, `EnrollmentUser`, `CreateEnrollmentRequest`, `UpdateProgressRequest`
- `types/quiz.ts` — `Quiz`, `QuizQuestion`, `QuizAnswer`, `QuizAttempt`, `QuestionType`, `SubmitQuizRequest`, `SubmitQuizAnswer`, create/update request types for quizzes and questions
- `types/index.ts` — Barrel re-export of all types from all domain modules

**Notes:**
- All types derived from backend API swagger schemas in `plans/04-api-client-layer.md` Sections 2–3
- `QuizAnswer.isCorrect` intentionally omitted (not exposed to students by the API)
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0)
- Types importable via `@/types` barrel export

---

## Task 1.5: Set Up Providers ✅

**Files created/updated:**
- `components/providers/query-provider.tsx` — React Query provider with `QueryClient` (staleTime 5 min, gcTime 10 min, retry logic skipping 4xx, `refetchOnWindowFocus`, `refetchOnReconnect`). Includes `ReactQueryDevtools` in development.
- `components/providers/theme-provider.tsx` — `next-themes` provider with `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`.
- `components/providers/providers.tsx` — Composed provider wrapping `QueryProvider` → `ThemeProvider`.
- `app/layout.tsx` — Updated metadata (`title` with template, `description`), added `suppressHydrationWarning` on `<html>`, wrapped `{children}` with `<Providers>`.
- `lib/api/client.ts` — Added `ApiError` stub class (with `status`, `code`, `details`) and `apiClient` singleton stub to unblock TypeScript imports ahead of Task 2.2.

**Notes:**
- TypeScript compiles with no errors (`pnpm tsc --noEmit` exit 0)
- `suppressHydrationWarning` on `<html>` prevents next-themes hydration mismatch
- `Providers` is a `'use client'` boundary; root layout remains a Server Component

---

## Task 1.4: Create Directory Structure ✅

**Directories and files created:**

- `lib/api/client.ts` — Placeholder for API client (Task 2.2)
- `lib/api/endpoints.ts` — Placeholder for API endpoint constants (Task 2.2)
- `lib/api/types.ts` — Placeholder for API response envelope types (Task 2.2)
- `lib/api/services/` — Placeholder directory for service functions (Task 2.3)
- `types/api.ts` — Placeholder for `ApiResponse<T>`, `PaginatedResponse<T>`, etc. (Task 2.1)
- `types/auth.ts` — Placeholder for `AuthUser`, `AuthResponse`, etc. (Task 2.1)
- `types/course.ts` — Placeholder for `Course`, `Section`, `Lesson`, etc. (Task 2.1)
- `types/enrollment.ts` — Placeholder for `Enrollment`, `EnrollmentStatus`, etc. (Task 2.1)
- `types/quiz.ts` — Placeholder for `Quiz`, `QuizQuestion`, `QuizAttempt`, etc. (Task 2.1)
- `types/user.ts` — Placeholder for `User`, `Role`, etc. (Task 2.1)
- `types/tenant.ts` — Placeholder for `Tenant`, `TenantStatus`, etc. (Task 2.1)
- `types/index.ts` — Barrel export placeholder (Task 2.1)
- `stores/auth.store.ts` — Placeholder for Zustand auth store (Task 2.4)
- `stores/tenant.store.ts` — Placeholder for Zustand tenant store (Task 2.4)
- `stores/ui.store.ts` — Placeholder for Zustand UI store (Task 2.4)
- `hooks/` — Placeholder directory for shared hooks
- `components/layout/` — Placeholder directory for layout components (Task 3.2)
- `components/shared/` — Placeholder directory for shared components (Task 3.3)
- `components/providers/` — Placeholder directory for provider components (Task 1.5)
- `features/auth/{components,hooks,schemas}/` — Auth feature subdirectories
- `features/courses/{components,hooks,schemas}/` — Courses feature subdirectories
- `features/enrollments/{components,hooks,schemas}/` — Enrollments feature subdirectories
- `features/quizzes/{components,hooks,schemas}/` — Quizzes feature subdirectories
- `features/users/{components,hooks,schemas}/` — Users feature subdirectories
- `features/tenants/{components,hooks,schemas}/` — Tenants feature subdirectories

**Notes:**
- All `.ts` files contain `export {}` placeholder with comments describing full implementation
- All empty directories use `.gitkeep` to be tracked by git
- TypeScript compiles with no errors (placeholder files use `export {}`)

---

## Task 1.3: Environment Configuration ✅

**Files created/updated:**
- `.env.local` — Local development environment variables
- `.env.example` — Template with placeholder values (committed to repo)
- `next.config.ts` — Updated with `images.remotePatterns` for CDN domains and API rewrites

**Environment variables configured:**
- `NEXT_PUBLIC_API_URL=http://localhost:3000` — Backend API base URL
- `NEXT_PUBLIC_APP_URL=http://localhost:3001` — Frontend app URL
- `NEXT_PUBLIC_DEFAULT_TENANT_SLUG=demo` — Default tenant for development

**next.config.ts additions:**
- `images.remotePatterns` for AWS S3, Cloudinary, Supabase, Gravatar CDN domains
- `rewrites()` proxying `/api/v1/*` → `NEXT_PUBLIC_API_URL/api/v1/*` for CORS-free dev

**Notes:**
- `.env.local` is covered by `.env*` pattern in `.gitignore` (not committed)
- `.env.example` is committed as a template for new developers

---

## Task 1.2: Initialize shadcn/ui ✅

**shadcn/ui initialized with:**
- Style: New York
- Base color: Neutral
- CSS variables: Yes (oklch color space)
- Tailwind CSS v4 config
- Components directory: `components/ui`
- Utils location: `lib/utils.ts`

**Core shadcn components installed:**
- `button`, `card`, `input`, `label`, `dialog`, `dropdown-menu`
- `tabs`, `table`, `badge`, `avatar`, `skeleton`, `progress`
- `select`, `textarea`, `checkbox`, `switch`, `separator`, `sheet`
- `scroll-area`, `alert-dialog`, `command`, `popover`, `radio-group`, `sonner`

**Additional dependencies installed:**
- `clsx` 2.1.1
- `tailwind-merge` 3.5.0
- `class-variance-authority` 0.7.1
- `lucide-react` 0.575.0
- `radix-ui` 1.4.3
- `tw-animate-css` 1.4.0
- `cmdk` 1.1.1

**Files created/updated:**
- `components.json` — shadcn configuration
- `components/ui/` — 24 UI component files
- `lib/utils.ts` — `cn()` utility function
- `app/globals.css` — Updated with project color palette (deep indigo primary, green accent)

---

## Task 1.1: Install Dependencies ✅

**Production dependencies installed:**
- `@tanstack/react-query` 5.90.21
- `@tanstack/react-query-devtools` 5.91.3
- `zustand` 5.0.11
- `react-hook-form` 7.71.2
- `zod` 4.3.6
- `@hookform/resolvers` 5.2.2
- `date-fns` 4.1.0
- `nuqs` 2.8.8
- `sonner` 2.0.7
- `next-themes` 0.4.6
- `@dnd-kit/core` 6.3.1
- `@dnd-kit/sortable` 10.0.0
- `@dnd-kit/utilities` 3.2.2

**Dev dependencies installed:**
- `prettier` 3.8.1
- `prettier-plugin-tailwindcss` 0.7.2