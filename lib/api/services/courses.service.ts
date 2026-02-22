/**
 * Courses Service — Task 2.3
 * Typed service functions for course management endpoints.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  PaginationParams,
} from '@/types'

export const coursesService = {
  /**
   * List courses with optional pagination and filters.
   */
  list: (
    params?: PaginationParams & { search?: string; status?: string; level?: string },
  ): Promise<Course[]> =>
    apiClient.get<Course[]>(
      ENDPOINTS.courses.list,
      params as Record<string, string | number | boolean | undefined | null>,
    ),

  /**
   * Get a single course by ID.
   */
  getById: (id: string): Promise<Course> =>
    apiClient.get<Course>(ENDPOINTS.courses.detail(id)),

  /**
   * Create a new course.
   */
  create: (data: CreateCourseRequest): Promise<Course> =>
    apiClient.post<Course>(ENDPOINTS.courses.create, data),

  /**
   * Update course metadata.
   */
  update: (id: string, data: UpdateCourseRequest): Promise<Course> =>
    apiClient.patch<Course>(ENDPOINTS.courses.update(id), data),

  /**
   * Delete a course permanently.
   */
  delete: (id: string): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.courses.delete(id)),

  /**
   * Publish a draft course, making it visible to students.
   */
  publish: (id: string): Promise<Course> =>
    apiClient.patch<Course>(ENDPOINTS.courses.publish(id)),

  /**
   * Archive a published course, hiding it from new enrollments.
   */
  archive: (id: string): Promise<Course> =>
    apiClient.patch<Course>(ENDPOINTS.courses.archive(id)),
}
