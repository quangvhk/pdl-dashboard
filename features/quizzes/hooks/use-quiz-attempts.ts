'use client'

import { useQuery } from '@tanstack/react-query'
import { quizzesService } from '@/lib/api/services/quizzes.service'
import { quizzesQueryKeys } from './use-quiz'

/**
 * Fetch all attempts for a quiz.
 * Enabled only when quizId is truthy.
 */
export function useQuizAttempts(quizId: string) {
  return useQuery({
    queryKey: quizzesQueryKeys.attempts(quizId),
    queryFn: () => quizzesService.listAttempts(quizId),
    enabled: !!quizId,
    staleTime: 1 * 60 * 1000, // 1 minute — attempts change after each submission
  })
}
