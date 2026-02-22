'use client'

import { useQuery } from '@tanstack/react-query'
import { sectionsService } from '@/lib/api/services/sections.service'
import { coursesQueryKeys } from './use-courses'

export const sectionsQueryKeys = {
  all: ['sections'] as const,
  byCourse: (courseId: string) => [...coursesQueryKeys.detail(courseId), 'sections'] as const,
}

export function useSections(courseId: string) {
  return useQuery({
    queryKey: sectionsQueryKeys.byCourse(courseId),
    queryFn: () => sectionsService.list(courseId),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
