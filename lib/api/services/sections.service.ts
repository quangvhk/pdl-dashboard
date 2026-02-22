/**
 * Sections Service — Task 2.3
 * Typed service functions for course section endpoints.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type { Section, CreateSectionRequest, UpdateSectionRequest } from '@/types'

export const sectionsService = {
  /**
   * List all sections for a course.
   */
  list: (courseId: string): Promise<Section[]> =>
    apiClient.get<Section[]>(ENDPOINTS.sections.list(courseId)),

  /**
   * Create a new section within a course.
   */
  create: (courseId: string, data: CreateSectionRequest): Promise<Section> =>
    apiClient.post<Section>(ENDPOINTS.sections.create(courseId), data),

  /**
   * Update a section's details.
   */
  update: (courseId: string, id: string, data: UpdateSectionRequest): Promise<Section> =>
    apiClient.patch<Section>(ENDPOINTS.sections.update(courseId, id), data),

  /**
   * Delete a section and all its lessons.
   */
  delete: (courseId: string, id: string): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.sections.delete(courseId, id)),
}
