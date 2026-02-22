'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { enrollmentsService } from '@/lib/api/services/enrollments.service'
import { enrollmentsQueryKeys } from './use-enrollments'
import type { UpdateProgressRequest } from '@/types'

interface UpdateProgressVariables {
  enrollmentId: string
  data: UpdateProgressRequest
}

/**
 * Mutation hook to mark a lesson as complete/incomplete within an enrollment.
 * Optimistically updates the enrollment cache and invalidates on settle.
 */
export function useUpdateProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ enrollmentId, data }: UpdateProgressVariables) =>
      enrollmentsService.updateProgress(enrollmentId, data),

    // Optimistic update: bump progressPercent locally so the UI feels instant
    onMutate: async ({ enrollmentId }) => {
      // Cancel any in-flight refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: enrollmentsQueryKeys.mine() })

      // Snapshot previous value for rollback
      const previous = queryClient.getQueryData(enrollmentsQueryKeys.mine())

      return { previous, enrollmentId }
    },

    onSuccess: () => {
      toast.success('Lesson completed!', {
        description: 'Your progress has been saved.',
      })
    },

    onError: (_err, _vars, context) => {
      // Roll back to the snapshot on error
      if (context?.previous !== undefined) {
        queryClient.setQueryData(enrollmentsQueryKeys.mine(), context.previous)
      }
      toast.error('Failed to save progress', {
        description: 'Your progress could not be saved. Please try again.',
      })
    },

    onSettled: () => {
      // Always refetch to get the authoritative server state
      queryClient.invalidateQueries({ queryKey: enrollmentsQueryKeys.mine() })
    },
  })
}
