export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'DROPPED'

export interface EnrollmentCourse {
  id: string
  title: string
  slug: string
  thumbnail: string | null
  level: string
}

export interface EnrollmentUser {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  tenantId: string
  status: EnrollmentStatus
  progressPercent: number
  enrolledAt: string
  completedAt: string | null
  course?: EnrollmentCourse
  user?: EnrollmentUser
}

export interface CreateEnrollmentRequest {
  courseId: string
}

export interface UpdateProgressRequest {
  lessonId: string
  completed: boolean
}
