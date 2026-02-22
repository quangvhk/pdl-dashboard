# Pandalang Frontend — Page Inventory

## 1. Route Map

Every page in the application with its route, component, data requirements, and role access.

```mermaid
graph TD
    subgraph Public
        L[/login]
        R[/register]
    end

    subgraph Dashboard
        D[/dashboard]
    end

    subgraph Courses
        CL[/courses]
        CN[/courses/new]
        CD[/courses/:id]
        CE[/courses/:id/edit]
        CLV[/courses/:id/sections/:sId/lessons/:lId]
        CQ[/courses/:id/quizzes/:qId]
        CEN[/courses/:id/enrollments]
    end

    subgraph Enrollments
        EL[/enrollments]
    end

    subgraph Users
        UL[/users]
        UN[/users/new]
        UD[/users/:id]
    end

    subgraph Tenants
        TL[/tenants]
        TN[/tenants/new]
        TD[/tenants/:id]
    end

    subgraph Settings
        S[/settings]
    end
```

---

## 2. Page Details

### 2.1 Login — `/login`

| Field | Value |
|-------|-------|
| **Route** | `app/(auth)/login/page.tsx` |
| **Roles** | Public (unauthenticated only) |
| **API Calls** | `POST /api/v1/auth/login` |
| **State** | Auth store (write tokens) |

**Layout:**
```
┌─────────────────────────────────┐
│         🐼 Pandalang            │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Email                    │  │
│  │  [________________________]  │
│  │                           │  │
│  │  Password                 │  │
│  │  [________________________]  │
│  │                           │  │
│  │  Tenant                   │  │
│  │  [________________________]  │
│  │                           │  │
│  │  [      Sign In         ] │  │
│  │                           │  │
│  │  Don't have an account?   │  │
│  │  Sign up                  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Behavior:**
- Pre-fill tenant slug from env var in development
- Show validation errors inline
- Show API errors (invalid credentials, account locked) as alert
- Redirect to `/dashboard` on success (or `callbackUrl` from query param)

---

### 2.2 Register — `/register`

| Field | Value |
|-------|-------|
| **Route** | `app/(auth)/register/page.tsx` |
| **Roles** | Public (unauthenticated only) |
| **API Calls** | `POST /api/v1/auth/register` |
| **State** | Auth store (write tokens) |

**Layout:**
```
┌─────────────────────────────────┐
│         🐼 Pandalang            │
│                                 │
│  ┌───────────────────────────┐  │
│  │  First Name               │  │
│  │  [________________________]  │
│  │  Last Name                │  │
│  │  [________________________]  │
│  │  Email                    │  │
│  │  [________________________]  │
│  │  Password                 │  │
│  │  [________________________]  │
│  │  Tenant                   │  │
│  │  [________________________]  │
│  │                           │  │
│  │  [    Create Account    ] │  │
│  │                           │  │
│  │  Already have an account? │  │
│  │  Sign in                  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Behavior:**
- Password strength indicator (min 8 chars, uppercase, lowercase, digit)
- Show 409 error if email already exists
- Auto-login after successful registration

---

### 2.3 Dashboard — `/dashboard`

| Field | Value |
|-------|-------|
| **Route** | `app/(dashboard)/dashboard/page.tsx` |
| **Roles** | All authenticated |
| **API Calls** | Varies by role |
| **State** | Auth store (read user/roles) |

**Role-specific content:**

**Student Dashboard:**
```
┌──────────────────────────────────────────┐
│  Welcome back, Jane! 👋                  │
│                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Enrolled │ │ In Prog  │ │ Complete │ │
│  │    5     │ │    3     │ │    2     │ │
│  └──────────┘ └──────────┘ └──────────┘ │
│                                          │
│  Continue Learning                       │
│  ┌──────────────────────────────────┐    │
│  │ 📚 Mandarin Basics    ████░ 60% │    │
│  │    Next: Lesson 4 - Tones       │    │
│  │    [Continue →]                  │    │
│  └──────────────────────────────────┘    │
│  ┌──────────────────────────────────┐    │
│  │ 📚 HSK Level 1        ██░░░ 30% │    │
│  │    Next: Lesson 2 - Numbers     │    │
│  │    [Continue →]                  │    │
│  └──────────────────────────────────┘    │
│                                          │
│  Browse Courses →                        │
└──────────────────────────────────────────┘
```

**Instructor Dashboard:**
```
┌──────────────────────────────────────────┐
│  Welcome back, Prof. Wang! 👋            │
│                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Courses  │ │ Students │ │ Published│ │
│  │    8     │ │   120    │ │    5     │ │
│  └──────────┘ └──────────┘ └──────────┘ │
│                                          │
│  My Courses                              │
│  ┌────────────┐ ┌────────────┐           │
│  │ Mandarin   │ │ HSK Prep   │           │
│  │ Basics     │ │ Level 2    │           │
│  │ PUBLISHED  │ │ DRAFT      │           │
│  │ 45 students│ │ 0 students │           │
│  └────────────┘ └────────────┘           │
│                                          │
│  [+ Create New Course]                   │
└──────────────────────────────────────────┘
```

**Tenant Admin Dashboard:**
```
┌──────────────────────────────────────────┐
│  Beijing Language Academy                │
│                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Users    │ │ Courses  │ │ Enrolled │ │
│  │   250    │ │   12     │ │   180    │ │
│  └──────────┘ └──────────┘ └──────────┘ │
│                                          │
│  Recent Activity                         │
│  • 5 new students registered today       │
│  • Course "HSK 3" published              │
│  • 12 quiz attempts today                │
│                                          │
│  Quick Actions                           │
│  [Manage Users] [View Courses]           │
└──────────────────────────────────────────┘
```

---

### 2.4 Course List — `/courses`

| Field | Value |
|-------|-------|
| **Route** | `app/(dashboard)/courses/page.tsx` |
| **Roles** | All authenticated |
| **API Calls** | `GET /api/v1/courses` (with role-based filtering) |
| **URL State** | `?search=&status=&level=&page=1&sortBy=createdAt&sortOrder=desc` |

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  Courses                        [+ New Course]   │
│                                                  │
│  [Search...________] [Level ▼] [Status ▼]        │
│                                                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │ 🖼️         │ │ 🖼️         │ │ 🖼️         │   │
│  │ Mandarin   │ │ HSK Prep   │ │ Business   │   │
│  │ Basics     │ │ Level 1    │ │ Chinese    │   │
│  │            │ │            │ │            │   │
│  │ BEGINNER   │ │ BEGINNER   │ │ ADVANCED   │   │
│  │ ⭐ 4.5     │ │ ⭐ 4.8     │ │ ⭐ 4.2     │   │
│  │ 3 sections │ │ 5 sections │ │ 4 sections │   │
│  └────────────┘ └────────────┘ └────────────┘   │
│                                                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │ ...        │ │ ...        │ │ ...        │   │
│  └────────────┘ └────────────┘ └────────────┘   │
│                                                  │
│  [← Prev]  Page 1 of 5  [Next →]                │
└──────────────────────────────────────────────────┘
```

**Behavior:**
- Students see only PUBLISHED courses
- Instructors see their own courses (all statuses)
- Admins see all courses
- "New Course" button visible only to Instructor/Admin
- Filters sync with URL via nuqs
- Course cards link to `/courses/[courseId]`

---

### 2.5 Course Detail — `/courses/[courseId]`

| Field | Value |
|-------|-------|
| **Route** | `app/(dashboard)/courses/[courseId]/page.tsx` |
| **Roles** | All authenticated |
| **API Calls** | `GET /api/v1/courses/:id`, `GET /api/v1/courses/:id/sections`, enrollment status |
| **State** | Enrollment status for students |

**Layout (Student View):**
```
┌──────────────────────────────────────────────────┐
│  ← Back to Courses                               │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │  🖼️ Course Thumbnail                     │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  Mandarin Chinese for Beginners                  │
│  BEGINNER · PUBLISHED · 3 sections · 9 lessons   │
│                                                  │
│  Learn the fundamentals of Mandarin Chinese...   │
│                                                  │
│  [Enroll Now]  or  [Continue Learning ████ 60%]  │
│                                                  │
│  Course Content                                  │
│  ┌──────────────────────────────────────────┐    │
│  │ ▼ Section 1: Introduction to Tones       │    │
│  │   ✅ Lesson 1: The Four Tones            │    │
│  │   ✅ Lesson 2: Tone Pairs                │    │
│  │   ○  Lesson 3: Tone Practice             │    │
│  │   📝 Quiz: Tone Recognition              │    │
│  ├──────────────────────────────────────────┤    │
│  │ ▶ Section 2: Basic Greetings (3 lessons) │    │
│  ├──────────────────────────────────────────┤    │
│  │ ▶ Section 3: Numbers (3 lessons)         │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

**Behavior:**
- Show "Enroll Now" if student is not enrolled
- Show progress bar and "Continue Learning" if enrolled
- Sections are collapsible accordions
- Completed lessons show ✅, current shows ○
- Clicking a lesson navigates to lesson viewer
- Instructor/Admin see "Edit Course" button instead

---

### 2.6 Course Editor — `/courses/[courseId]/edit`

| Field | Value |
|-------|-------|
| **Route** | `app/(dashboard)/courses/[courseId]/edit/page.tsx` |
| **Roles** | Instructor (own), Tenant Admin, Super Admin |
| **API Calls** | Course CRUD, Section CRUD, Lesson CRUD, Quiz CRUD |
| **State** | Form state, DnD state |

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  ← Back to Course                                │
│                                                  │
│  Edit: Mandarin Chinese for Beginners            │
│  Status: DRAFT    [Publish] [Archive] [Delete]   │
│                                                  │
│  ┌─ Course Details ─────────────────────────┐    │
│  │  Title: [Mandarin Chinese for Beginners] │    │
│  │  Description: [Learn the fundamentals..] │    │
│  │  Level: [BEGINNER ▼]                     │    │
│  │  [Save Changes]                          │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  Course Content                [+ Add Section]   │
│  ┌──────────────────────────────────────────┐    │
│  │ ≡ Section 1: Introduction to Tones  [✏️][🗑️]│    │
│  │   ├─ ≡ Lesson 1: The Four Tones    [✏️][🗑️]│    │
│  │   ├─ ≡ Lesson 2: Tone Pairs        [✏️][🗑️]│    │
│  │   ├─ ≡ Lesson 3: Tone Practice     [✏️][🗑️]│    │
│  │   ├─ 📝 Quiz: Tone Recognition     [✏️][🗑️]│    │
│  │   └─ [+ Add Lesson] [+ Add Quiz]        │    │
│  ├──────────────────────────────────────────┤    │
│  │ ≡ Section 2: Basic Greetings       [✏️][🗑️]│    │
│  │   └─ [+ Add Lesson] [+ Add Quiz]        │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

**Behavior:**
- ≡ icons are drag handles for reordering (via @dnd-kit)
- Edit/delete buttons open dialogs
- "Add Lesson" opens a form dialog
- "Add Quiz" opens a quiz creation dialog
- "Publish" validates course has content, then publishes
- Real-time save with debounce on text fields

---

### 2.7 Lesson Viewer — `/courses/[courseId]/sections/[sectionId]/lessons/[lessonId]`

| Field | Value |
|-------|-------|
| **Route** | `app/(dashboard)/courses/[courseId]/sections/[sectionId]/lessons/[lessonId]/page.tsx` |
| **Roles** | Enrolled Student, Instructor, Admin |
| **API Calls** | `GET .../lessons/:id`, `POST /enrollments/:id/progress` |

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  ← Mandarin Chinese for Beginners                │
│  Section 1: Introduction to Tones                │
│                                                  │
│  Lesson 1: The Four Tones                        │
│  ─────────────────────────────────────────────── │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │                                          │    │
│  │     [Video Player / Text Content]        │    │
│  │                                          │    │
│  │     Mandarin Chinese has four tones...   │    │
│  │                                          │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ⏱️ Time spent: 5 min                            │
│                                                  │
│  [← Previous Lesson]  [Mark Complete ✓]  [Next →]│
└──────────────────────────────────────────────────┘
```

**Behavior:**
- Content type determines renderer (text, video embed, audio player)
- "Mark Complete" sends progress update to API
- Navigation between lessons within the section
- Time tracking (optional, sent on completion)
- Sidebar shows section outline with current position

---

### 2.8 Quiz Taker — `/courses/[courseId]/quizzes/[quizId]`

| Field | Value |
|-------|-------|
| **Route** | `app/(dashboard)/courses/[courseId]/quizzes/[quizId]/page.tsx` |
| **Roles** | Enrolled Student |
| **API Calls** | `GET /quizzes/:id`, `POST /quizzes/:id/attempts` |

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  Quiz: Tone Recognition                          │
│  ⏱️ Time remaining: 25:00    3/10 questions       │
│  ─────────────────────────────────────────────── │
│                                                  │
│  Question 3 of 10                                │
│  Which tone is represented by a flat line?       │
│                                                  │
│  ○ First tone (flat)                             │
│  ○ Second tone (rising)                          │
│  ○ Third tone (dipping)                          │
│  ○ Fourth tone (falling)                         │
│                                                  │
│  ████████░░░░░░░░░░░░░░░░░░░░  30%              │
│                                                  │
│  [← Previous]              [Next →]              │
│                                                  │
│  [Submit Quiz]                                   │
└──────────────────────────────────────────────────┘
```

**Results View:**
```
┌──────────────────────────────────────────────────┐
│  Quiz Results: Tone Recognition                  │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │         Score: 8/10 (80%)                │    │
│  │         Status: ✅ PASSED                │    │
│  │         Passing Score: 70%               │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  [Back to Course]  [View Attempt History]        │
└──────────────────────────────────────────────────┘
```

---

### 2.9 My Enrollments — `/enrollments`

| Field | Value |
|-------|-------|
| **Route** | `app/(dashboard)/enrollments/page.tsx` |
| **Roles** | Student |
| **API Calls** | `GET /api/v1/enrollments/me` |

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  My Enrollments                                  │
│                                                  │
│  ┌─ In Progress ────────────────────────────┐    │
│  │ ┌────────────┐ ┌────────────┐            │    │
│  │ │ 🖼️ Mandarin│ │ 🖼️ HSK 1   │            │    │
│  │ │ Basics     │ │ Prep       │            │    │
│  │ │ ████░ 60%  │ │ ██░░░ 30%  │            │    │
│  │ │ [Continue] │ │ [Continue] │            │    │
│  │ └────────────┘ └────────────┘            │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ┌─ Completed ──────────────────────────────┐    │
│  │ ┌────────────┐                           │    │
│  │ │ 🖼️ Pinyin  │                           │    │
│  │ │ Mastery    │                           │    │
│  │ │ ✅ 100%    │                           │    │
│  │ │ Completed  │                           │    │
│  │ └────────────┘                           │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  [Browse More Courses →]                         │
└──────────────────────────────────────────────────┘
```

---

### 2.10 Course Enrollments (Instructor) — `/courses/[courseId]/enrollments`

| Field | Value |
|-------|-------|
| **Route** | `app/(dashboard)/courses/[courseId]/enrollments/page.tsx` |
| **Roles** | Instructor (own course), Tenant Admin, Super Admin |
| **API Calls** | `GET /api/v1/courses/:id/enrollments` |

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  ← Mandarin Chinese for Beginners                │
│  Enrolled Students (45)                          │
│                                                  │
│  [Search students...________]                    │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │ Student          │ Progress │ Status     │    │
│  ├──────────────────┼──────────┼────────────┤    │
│  │ Jane Doe         │ ████ 80% │ ACTIVE     │    │
│  │ john@example.com │ ██░░ 40% │ ACTIVE     │    │
│  │ Li Wei           │ █████100%│ COMPLETED  │    │
│  │ Sarah Chen       │ █░░░ 15% │ ACTIVE     │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  [← Prev]  Page 1 of 3  [Next →]                │
└──────────────────────────────────────────────────┘
```

---

### 2.11 User Management — `/users`

| Field | Value |
|-------|-------|
| **Route** | `app/(dashboard)/users/page.tsx` |
| **Roles** | Tenant Admin, Super Admin |
| **API Calls** | `GET /api/v1/users` |
| **URL State** | `?search=&roleId=&isActive=&page=1` |

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  Users                              [+ New User] │
│                                                  │
│  [Search...________] [Role ▼] [Active ▼]         │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │ Name          │ Email       │ Role    │ ⚡│    │
│  ├───────────────┼─────────────┼─────────┼───┤    │
│  │ Jane Doe      │ jane@...    │ STUDENT │ ✏️│    │
│  │ Prof. Wang    │ wang@...    │ INSTR.  │ ✏️│    │
│  │ Admin Li      │ admin@...   │ ADMIN   │ ✏️│    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  Showing 1-20 of 250  [← Prev] [Next →]         │
└──────────────────────────────────────────────────┘
```

---

### 2.12 Create User — `/users/new`

| Field | Value |
|-------|-------|
| **Route** | `app/(dashboard)/users/new/page.tsx` |
| **Roles** | Tenant Admin |
| **API Calls** | `POST /api/v1/users` |

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  ← Back to Users                                 │
│  Create New User                                 │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │  First Name: [________________________]  │    │
│  │  Last Name:  [________________________]  │    │
│  │  Email:      [________________________]  │    │
│  │  Password:   [________________________]  │    │
│  │  Role:       [STUDENT ▼]                 │    │
│  │                                          │    │
│  │  [Cancel]              [Create User]     │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

---

### 2.13 Tenant Management — `/tenants`

| Field | Value |
|-------|-------|
| **Route** | `app/(dashboard)/tenants/page.tsx` |
| **Roles** | Super Admin only |
| **API Calls** | `GET /api/v1/tenants` |

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  Tenants                          [+ New Tenant] │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │ Name              │ Slug      │ Status   │    │
│  ├───────────────────┼───────────┼──────────┤    │
│  │ Beijing Academy   │ beijing   │ 🟢 ACTIVE│    │
│  │ Shanghai School   │ shanghai  │ 🟢 ACTIVE│    │
│  │ Demo Tenant       │ demo      │ 🔵 TRIAL │    │
│  │ Old School        │ old       │ 🔴 SUSP. │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  Showing 1-4 of 4                                │
└──────────────────────────────────────────────────┘
```

---

### 2.14 Tenant Detail — `/tenants/[tenantId]`

| Field | Value |
|-------|-------|
| **Route** | `app/(dashboard)/tenants/[tenantId]/page.tsx` |
| **Roles** | Super Admin |
| **API Calls** | `GET /api/v1/tenants/:id`, `PATCH /api/v1/tenants/:id` |

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  ← Back to Tenants                               │
│  Beijing Language Academy                        │
│  Status: 🟢 ACTIVE  [Suspend] [Activate]         │
│                                                  │
│  ┌─ Tenant Settings ───────────────────────┐     │
│  │  Name:   [Beijing Language Academy____] │     │
│  │  Slug:   beijing-academy (read-only)    │     │
│  │  Domain: [beijing.pandalang.com_______] │     │
│  │                                         │     │
│  │  Settings (JSON):                       │     │
│  │  [{ "theme": "light", "lang": "zh" }]  │     │
│  │                                         │     │
│  │  [Save Changes]                         │     │
│  └─────────────────────────────────────────┘     │
│                                                  │
│  Stats: 250 users · 12 courses · 180 enrollments │
└──────────────────────────────────────────────────┘
```

---

### 2.15 Settings — `/settings`

| Field | Value |
|-------|-------|
| **Route** | `app/(dashboard)/settings/page.tsx` |
| **Roles** | All authenticated |
| **API Calls** | `GET /api/v1/auth/me`, `PATCH /api/v1/users/:id` |

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  Settings                                        │
│                                                  │
│  ┌─ Profile ────────────────────────────────┐    │
│  │  [Avatar]                                │    │
│  │  First Name: [Jane___________________]   │    │
│  │  Last Name:  [Doe____________________]   │    │
│  │  Email:      jane@demo.pandalang.com     │    │
│  │              (read-only)                 │    │
│  │                                          │    │
│  │  [Save Profile]                          │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ┌─ Appearance ─────────────────────────────┐    │
│  │  Theme: [Light ○] [Dark ○] [System ●]    │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ┌─ Account ────────────────────────────────┐    │
│  │  Role: STUDENT                           │    │
│  │  Tenant: Beijing Language Academy        │    │
│  │  Member since: Jan 1, 2026               │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

---

## 3. Page Count Summary

| Category | Pages | Routes |
|----------|-------|--------|
| Auth | 2 | `/login`, `/register` |
| Dashboard | 1 | `/dashboard` |
| Courses | 5 | list, detail, new, edit, lesson viewer |
| Quizzes | 1 | quiz taker |
| Enrollments | 2 | my enrollments, course enrollments |
| Users | 3 | list, detail, new |
| Tenants | 3 | list, detail, new |
| Settings | 1 | profile settings |
| **Total** | **18** | |