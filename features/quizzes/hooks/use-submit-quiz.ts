'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { quizzesService } from '@/lib/api/services/quizzes.service'
import { quizzesQueryKeys } from './use-quiz'
import type { SubmitQuizRequest } from '@/types'

interface SubmitQuizVariables {
  quizId: string
  data: SubmitQuizRequest
}

/**
 * Mutation hook to submit a quiz attempt and receive a graded result.
 * Invalidates the attempts cache for the quiz on settle so the history
 * list stays fresh.
 */
export function useSubmitQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ quizId, data }: SubmitQuizVariables) =>
      quizzesService.submitAttempt(quizId, data),

    onSuccess: (attempt) => {
      const passed = attempt.passed
      if (passed) {
        toast.success('Quiz passed! 🎉', {
          description: `You scored ${attempt.score}%. Great work!`,
        })
      } else {
        toast.info('Quiz submitted', {
          description: `You scored ${attempt.score}%. Review the material and try again.`,
        })
      }
    },

    onError: (err) => {
      toast.error('Failed to submit quiz', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },

    onSettled: (_data, _error, variables) => {
      // Refresh the attempts list so the history view is up-to-date
      queryClient.invalidateQueries({
        queryKey: quizzesQueryKeys.attempts(variables.quizId),
      })
    },
  })
}
