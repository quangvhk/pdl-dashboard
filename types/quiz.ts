export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK'

export interface QuizAnswer {
  id: string
  answer: string
  sortOrder: number
  // isCorrect is NOT exposed to students by the API
}

export interface QuizQuestion {
  id: string
  quizId: string
  question: string
  questionType: QuestionType
  points: number
  sortOrder: number
  answers?: QuizAnswer[]
}

export interface Quiz {
  id: string
  sectionId: string
  title: string
  description: string | null
  passingScore: number
  timeLimitMinutes: number | null
  sortOrder: number
  createdAt: string
  updatedAt: string
  questions?: QuizQuestion[]
  questionsCount?: number
}

export interface QuizAttempt {
  id: string
  userId: string
  quizId: string
  enrollmentId: string
  score: number
  maxScore: number
  passed: boolean
  answers: unknown
  startedAt: string
  completedAt: string | null
}

export interface SubmitQuizAnswer {
  questionId: string
  answerId?: string
  textAnswer?: string
}

export interface SubmitQuizRequest {
  enrollmentId: string
  answers: SubmitQuizAnswer[]
}

export interface CreateQuizRequest {
  title: string
  description?: string
  passingScore?: number
  timeLimitMinutes?: number | null
  sortOrder?: number
}

export interface UpdateQuizRequest {
  title?: string
  description?: string | null
  passingScore?: number
  timeLimitMinutes?: number | null
  sortOrder?: number
}

export interface CreateQuestionRequest {
  question: string
  questionType: QuestionType
  points?: number
  sortOrder?: number
  answers: Array<{
    answer: string
    isCorrect: boolean
    sortOrder?: number
  }>
}

export interface UpdateQuestionRequest {
  question?: string
  questionType?: QuestionType
  points?: number
  sortOrder?: number
  answers?: Array<{
    id?: string
    answer: string
    isCorrect: boolean
    sortOrder?: number
  }>
}
