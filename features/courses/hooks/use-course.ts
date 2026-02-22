'use client'

import { useQuery } from '@tanstack/react-query'
import { coursesService } from '@/lib/api/services/courses.service'
import { coursesQueryKeys } from './use-courses'

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: coursesQueryKeys.detail(courseId),
    queryFn: () => coursesService.getById(courseId),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
