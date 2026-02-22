export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type ContentType = 'TEXT' | 'VIDEO' | 'AUDIO' | 'DOCUMENT'

export interface Course {
  id: string
  tenantId: string
  instructorId: string
  title: string
  slug: string
  description: string | null
  thumbnail: string | null
  level: CourseLevel
  status: CourseStatus
  sortOrder: number
  metadata: Record<string, unknown>
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  sectionsCount?: number
  lessonsCount?: number
}

export interface Section {
  id: string
  courseId: string
  title: string
  description: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
  lessonsCount?: number
}

export interface Lesson {
  id: string
  sectionId: string
  title: string
  content: string | null
  contentType: ContentType
  mediaUrl: string | null
  durationMinutes: number | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CreateCourseRequest {
  title: string
  description?: string
  level?: CourseLevel
  thumbnail?: string
}

export interface UpdateCourseRequest {
  title?: string
  description?: string | null
  level?: CourseLevel
  thumbnail?: string | null
  sortOrder?: number
  metadata?: Record<string, unknown>
}

export interface CreateSectionRequest {
  title: string
  description?: string
  sortOrder?: number
}

export interface UpdateSectionRequest {
  title?: string
  description?: string | null
  sortOrder?: number
}

export interface CreateLessonRequest {
  title: string
  content?: string
  contentType?: ContentType
  mediaUrl?: string
  durationMinutes?: number
  sortOrder?: number
}

export interface UpdateLessonRequest {
  title?: string
  content?: string | null
  contentType?: ContentType
  mediaUrl?: string | null
  durationMinutes?: number | null
  sortOrder?: number
}
