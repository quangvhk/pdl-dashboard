/**
 * Enrollments Service — Task 2.3
 * Typed service functions for enrollment endpoints.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type {
  Enrollment,
  CreateEnrollmentRequest,
  UpdateProgressRequest,
  PaginationParams,
} from '@/types'

export const enrollmentsService = {
  /**
   * Enroll the current user in a course.
   */
  create: (data: CreateEnrollmentRequest): Promise<Enrollment> =>
    apiClient.post<Enrollment>(ENDPOINTS.enrollments.create, data),

  /**
   * Get all enrollments for the currently authenticated user.
   */
  getMyEnrollments: (params?: PaginationParams): Promise<Enrollment[]> =>
    apiClient.get<Enrollment[]>(
      ENDPOINTS.enrollments.me,
      params as Record<string, string | number | boolean | undefined | null>,
    ),

  /**
   * Get a single enrollment by ID.
   */
  getById: (id: string): Promise<Enrollment> =>
    apiClient.get<Enrollment>(ENDPOINTS.enrollments.detail(id)),

  /**
   * Update lesson completion progress for an enrollment.
   */
  updateProgress: (id: string, data: UpdateProgressRequest): Promise<Enrollment> =>
    apiClient.patch<Enrollment>(ENDPOINTS.enrollments.updateProgress(id), data),

  /**
   * Get all enrollments for a specific course (instructor/admin view).
   */
  getCourseEnrollments: (
    courseId: string,
    params?: PaginationParams & { search?: string },
  ): Promise<Enrollment[]> =>
    apiClient.get<Enrollment[]>(
      ENDPOINTS.courses.enrollments(courseId),
      params as Record<string, string | number | boolean | undefined | null>,
    ),
}
