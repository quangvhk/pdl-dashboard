'use client'

import { useQuery } from '@tanstack/react-query'
import { enrollmentsService } from '@/lib/api/services/enrollments.service'
import { useAuthStore } from '@/stores/auth.store'

export const enrollmentsQueryKeys = {
  all: ['enrollments'] as const,
  mine: () => [...enrollmentsQueryKeys.all, 'me'] as const,
  detail: (id: string) => [...enrollmentsQueryKeys.all, 'detail', id] as const,
  byCourse: (courseId: string) =>
    [...enrollmentsQueryKeys.all, 'course', courseId] as const,
}

export function useMyEnrollments() {
  const isAuthenticated = useAuthStore((s) => !!s.user)

  return useQuery({
    queryKey: enrollmentsQueryKeys.mine(),
    queryFn: () => enrollmentsService.getMyEnrollments(),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
