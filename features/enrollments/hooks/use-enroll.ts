'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { enrollmentsService } from '@/lib/api/services/enrollments.service'
import { enrollmentsQueryKeys } from './use-enrollments'
import type { CreateEnrollmentRequest } from '@/types'

export function useEnroll() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEnrollmentRequest) => enrollmentsService.create(data),
    onSuccess: () => {
      // Invalidate my enrollments list so the new enrollment is reflected
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
