/**
 * Lessons Service — Task 2.3
 * Typed service functions for lesson endpoints.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type { Lesson, CreateLessonRequest, UpdateLessonRequest } from '@/types'

export const lessonsService = {
  /**
   * List all lessons within a section.
   */
  list: (courseId: string, sectionId: string): Promise<Lesson[]> =>
    apiClient.get<Lesson[]>(ENDPOINTS.lessons.list(courseId, sectionId)),

  /**
   * Get a single lesson by ID.
   */
  getById: (courseId: string, sectionId: string, id: string): Promise<Lesson> =>
    apiClient.get<Lesson>(ENDPOINTS.lessons.detail(courseId, sectionId, id)),

  /**
   * Create a new lesson within a section.
   */
  create: (courseId: string, sectionId: string, data: CreateLessonRequest): Promise<Lesson> =>
    apiClient.post<Lesson>(ENDPOINTS.lessons.create(courseId, sectionId), data),

  /**
   * Update a lesson's content or metadata.
   */
  update: (
    courseId: string,
    sectionId: string,
    id: string,
    data: UpdateLessonRequest,
  ): Promise<Lesson> =>
    apiClient.patch<Lesson>(ENDPOINTS.lessons.update(courseId, sectionId, id), data),

  /**
   * Delete a lesson permanently.
   */
  delete: (courseId: string, sectionId: string, id: string): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.lessons.delete(courseId, sectionId, id)),
}
