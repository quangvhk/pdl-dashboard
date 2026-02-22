'use client'

import { useQuery } from '@tanstack/react-query'
import { lessonsService } from '@/lib/api/services/lessons.service'
import { sectionsQueryKeys } from './use-sections'

export const lessonsQueryKeys = {
  all: ['lessons'] as const,
  bySection: (courseId: string, sectionId: string) =>
    [...sectionsQueryKeys.byCourse(courseId), 'sections', sectionId, 'lessons'] as const,
  detail: (courseId: string, sectionId: string, lessonId: string) =>
    [...lessonsQueryKeys.bySection(courseId, sectionId), lessonId] as const,
}

/** Fetch all lessons for a section. */
export function useLessons(courseId: string, sectionId: string) {
  return useQuery({
    queryKey: lessonsQueryKeys.bySection(courseId, sectionId),
    queryFn: () => lessonsService.list(courseId, sectionId),
    enabled: !!courseId && !!sectionId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/** Fetch a single lesson by ID. */
export function useLesson(courseId: string, sectionId: string, lessonId: string) {
  return useQuery({
    queryKey: lessonsQueryKeys.detail(courseId, sectionId, lessonId),
    queryFn: () => lessonsService.getById(courseId, sectionId, lessonId),
    enabled: !!courseId && !!sectionId && !!lessonId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
