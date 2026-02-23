'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { enrollmentsService } from '@/lib/api/services/enrollments.service'
import { enrollmentsQueryKeys } from './use-enrollments'
import type { CreateEnrollmentRequest, GrantEnrollmentRequest } from '@/types'

/**
 * Self-enrollment hook for students.
 * Calls POST /enrollments with { courseId } only.
 */
export function useEnroll() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEnrollmentRequest) => enrollmentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentsQueryKeys.mine() })
      toast.success('Enrolled successfully!', {
        description: 'You can now access the course content.',
      })
    },
    onError: (err) => {
      toast.error('Enrollment failed', {
        description: err instanceof Error ? err.message : 'Could not enroll in this course. Please try again.',
      })
    },
  })
}

/**
 * Admin/instructor grant-enrollment hook.
 * Calls POST /enrollments with { courseId, userId } to grant access to a specific user.
 */
export function useGrantEnrollment(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GrantEnrollmentRequest) => enrollmentsService.grantEnrollment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: enrollmentsQueryKeys.byCourse(courseId),
      })
      toast.success('Access granted!', {
        description: 'The user has been enrolled in this course.',
      })
    },
    onError: (err) => {
      toast.error('Failed to grant access', {
        description: err instanceof Error ? err.message : 'Could not grant course access. Please try again.',
      })
    },
  })
}
