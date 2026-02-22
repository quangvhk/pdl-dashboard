'use client'

import { useQuery } from '@tanstack/react-query'
import { quizzesService } from '@/lib/api/services/quizzes.service'

export const quizzesQueryKeys = {
  all: ['quizzes'] as const,
  detail: (id: string) => [...quizzesQueryKeys.all, 'detail', id] as const,
  attempts: (id: string) => [...quizzesQueryKeys.all, 'attempts', id] as const,
}

/**
 * Fetch a single quiz by ID (includes questions and answers).
 * Enabled only when quizId is truthy.
 */
export function useQuiz(quizId: string) {
  return useQuery({
    queryKey: quizzesQueryKeys.detail(quizId),
    queryFn: () => quizzesService.getById(quizId),
    enabled: !!quizId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
