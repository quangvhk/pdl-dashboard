'use client'

import { useQuery } from '@tanstack/react-query'
import { coursesService } from '@/lib/api/services/courses.service'
import type { PaginationParams } from '@/types'

export const coursesQueryKeys = {
  all: ['courses'] as const,
  lists: () => [...coursesQueryKeys.all, 'list'] as const,
  list: (params?: PaginationParams & { search?: string; status?: string; level?: string }) =>
    [...coursesQueryKeys.lists(), params] as const,
  details: () => [...coursesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...coursesQueryKeys.details(), id] as const,
}

interface UseCoursesParams extends PaginationParams {
  search?: string
  status?: string
  level?: string
}

export function useCourses(params?: UseCoursesParams) {
  return useQuery({
    queryKey: coursesQueryKeys.list(params),
    queryFn: () => coursesService.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
