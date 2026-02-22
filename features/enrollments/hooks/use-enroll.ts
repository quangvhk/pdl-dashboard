'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
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
    },
  })
}
