/**
 * Quizzes Service — Task 2.3
 * Typed service functions for quiz and question endpoints.
 */

import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type {
  Quiz,
  QuizQuestion,
  QuizAttempt,
  CreateQuizRequest,
  UpdateQuizRequest,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  SubmitQuizRequest,
} from '@/types'

export const quizzesService = {
  /**
   * Create a new quiz within a section.
   */
  create: (courseId: string, sectionId: string, data: CreateQuizRequest): Promise<Quiz> =>
    apiClient.post<Quiz>(ENDPOINTS.quizzes.create(courseId, sectionId), data),

  /**
   * Get a single quiz by ID (includes questions and answers).
   */
  getById: (id: string): Promise<Quiz> =>
    apiClient.get<Quiz>(ENDPOINTS.quizzes.detail(id)),

  /**
   * Update quiz metadata (title, description, passing score, time limit).
   */
  update: (id: string, data: UpdateQuizRequest): Promise<Quiz> =>
    apiClient.patch<Quiz>(ENDPOINTS.quizzes.update(id), data),

  /**
   * Delete a quiz and all its questions.
   */
  delete: (id: string): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.quizzes.delete(id)),

  /**
   * Add a question (with answers) to a quiz.
   */
  addQuestion: (id: string, data: CreateQuestionRequest): Promise<QuizQuestion> =>
    apiClient.post<QuizQuestion>(ENDPOINTS.quizzes.addQuestion(id), data),

  /**
   * Update an existing question and its answers.
   */
  updateQuestion: (id: string, qId: string, data: UpdateQuestionRequest): Promise<QuizQuestion> =>
    apiClient.patch<QuizQuestion>(ENDPOINTS.quizzes.updateQuestion(id, qId), data),

  /**
   * Delete a question from a quiz.
   */
  deleteQuestion: (id: string, qId: string): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.quizzes.deleteQuestion(id, qId)),

  /**
   * Submit a quiz attempt and receive a graded result.
   */
  submitAttempt: (id: string, data: SubmitQuizRequest): Promise<QuizAttempt> =>
    apiClient.post<QuizAttempt>(ENDPOINTS.quizzes.submitAttempt(id), data),

  /**
   * List all attempts for a quiz (instructor/admin view).
   */
  listAttempts: (id: string): Promise<QuizAttempt[]> =>
    apiClient.get<QuizAttempt[]>(ENDPOINTS.quizzes.listAttempts(id)),
}
