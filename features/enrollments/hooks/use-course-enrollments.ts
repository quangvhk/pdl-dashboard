'use client'

import { useQuery } from '@tanstack/react-query'
import { enrollmentsService } from '@/lib/api/services/enrollments.service'
import { enrollmentsQueryKeys } from './use-enrollments'

export interface UseCourseEnrollmentsParams {
  search?: string
  page?: number
  limit?: number
}

export function useCourseEnrollments(
  courseId: string,
  params?: UseCourseEnrollmentsParams,
) {
  return useQuery({
    queryKey: [...enrollmentsQueryKeys.byCourse(courseId), params] as const,
    queryFn: () =>
      enrollmentsService.getCourseEnrollments(courseId, {
        search: params?.search,
        page: params?.page,
        limit: params?.limit,
      }),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
