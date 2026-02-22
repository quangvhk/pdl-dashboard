'use client'

import { use } from 'react'
import { QuizTaker } from '@/features/quizzes/components/quiz-taker'

interface QuizPageProps {
  params: Promise<{ courseId: string; quizId: string }>
}

export default function QuizPage({ params }: QuizPageProps) {
  const { courseId, quizId } = use(params)
  return <QuizTaker courseId={courseId} quizId={quizId} />
}
