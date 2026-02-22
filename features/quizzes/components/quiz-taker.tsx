'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useQuiz } from '../hooks/use-quiz'
import { useSubmitQuiz } from '../hooks/use-submit-quiz'
import { QuizQuestion } from './quiz-question'
import { QuizResults, QuizResultsSkeleton } from './quiz-results'
import { useMyEnrollments } from '@/features/enrollments/hooks/use-enrollments'
import type { QuizAttempt } from '@/types'

interface QuizTakerProps {
  courseId: string
  quizId: string
}

/** Format seconds as MM:SS */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Full quiz-taking experience:
 * - Loads quiz with questions
 * - Tracks per-question answers in local state
 * - Optional countdown timer (when timeLimitMinutes is set)
 * - Previous/Next navigation
 * - Progress bar
 * - Confirmation dialog before submit
 * - Transitions to QuizResults on completion
 */
export function QuizTaker({ courseId, quizId }: QuizTakerProps) {
  const { data: quiz, isLoading: quizLoading, isError: quizError } = useQuiz(quizId)
  const { data: enrollments } = useMyEnrollments()
  const submitQuiz = useSubmitQuiz()

  // Current question index (0-based)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Map of questionId → answerId | textAnswer
  const [answers, setAnswers] = useState<Record<string, string>>({})

  // Timer state (seconds remaining; null = no timer)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Completed attempt (switches to results view)
  const [completedAttempt, setCompletedAttempt] = useState<QuizAttempt | null>(null)

  // Retake: reset all state
  const handleRetake = useCallback(() => {
    setCurrentIndex(0)
    setAnswers({})
    setCompletedAttempt(null)
    if (quiz?.timeLimitMinutes) {
      setTimeRemaining(quiz.timeLimitMinutes * 60)
    }
  }, [quiz])

  // Initialise timer when quiz loads
  useEffect(() => {
    if (quiz?.timeLimitMinutes && timeRemaining === null && !completedAttempt) {
      setTimeRemaining(quiz.timeLimitMinutes * 60)
    }
  }, [quiz, timeRemaining, completedAttempt])

  // Countdown tick
  useEffect(() => {
    if (timeRemaining === null || completedAttempt) return

    if (timeRemaining <= 0) {
      // Auto-submit when time runs out
      setConfirmOpen(false)
      handleSubmit()
      return
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, completedAttempt])

  // Derive enrollment for this course
  const enrollment = enrollments?.find((e) => e.course?.id === courseId)

  const questions = quiz?.questions ?? []
  const totalQuestions = questions.length
  const currentQuestion = questions[currentIndex]

  const answeredCount = Object.keys(answers).filter((qId) =>
    questions.some((q) => q.id === qId),
  ).length

  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0

  function handleAnswerChange(value: string) {
    if (!currentQuestion) return
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  function handlePrev() {
    setCurrentIndex((i) => Math.max(0, i - 1))
  }

  function handleNext() {
    setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))
  }

  async function handleSubmit() {
    if (!enrollment) return

    const submittedAnswers = questions.map((q) => {
      const val = answers[q.id]
      if (q.questionType === 'FILL_IN_BLANK') {
        return { questionId: q.id, textAnswer: val ?? '' }
      }
      return { questionId: q.id, answerId: val }
    })

    submitQuiz.mutate(
      {
        quizId,
        data: {
          enrollmentId: enrollment.id,
          answers: submittedAnswers,
        },
      },
      {
        onSuccess: (attempt) => {
          if (timerRef.current) clearInterval(timerRef.current)
          setCompletedAttempt(attempt)
        },
      },
    )
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (quizLoading) {
    return <QuizTakerSkeleton />
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (quizError || !quiz) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <p className="text-lg font-medium">Failed to load quiz</p>
        <p className="text-sm text-muted-foreground">
          The quiz could not be loaded. Please try again.
        </p>
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseId}`}>← Back to Course</Link>
        </Button>
      </div>
    )
  }

  // ── No enrollment guard ────────────────────────────────────────────────────
  if (!enrollment) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <AlertTriangle className="h-10 w-10 text-yellow-500" />
        <p className="text-lg font-medium">Not enrolled</p>
        <p className="text-sm text-muted-foreground">
          You must be enrolled in this course to take the quiz.
        </p>
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseId}`}>← Back to Course</Link>
        </Button>
      </div>
    )
  }

  // ── No questions guard ─────────────────────────────────────────────────────
  if (totalQuestions === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-lg font-medium">No questions yet</p>
        <p className="text-sm text-muted-foreground">
          This quiz has no questions. Check back later.
        </p>
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseId}`}>← Back to Course</Link>
        </Button>
      </div>
    )
  }

  // ── Results view ───────────────────────────────────────────────────────────
  if (completedAttempt) {
    return (
      <QuizResults
        quiz={quiz}
        attempt={completedAttempt}
        courseId={courseId}
        onRetake={handleRetake}
      />
    )
  }

  // ── Submitting overlay ─────────────────────────────────────────────────────
  if (submitQuiz.isPending) {
    return <QuizResultsSkeleton />
  }

  // ── Quiz taking UI ─────────────────────────────────────────────────────────
  const unansweredCount = totalQuestions - answeredCount
  const isTimeLow = timeRemaining !== null && timeRemaining <= 60

  return (
    <>
      <div className="mx-auto max-w-2xl space-y-6 py-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Button variant="ghost" size="sm" className="-ml-2 mb-1 text-muted-foreground" asChild>
                <Link href={`/courses/${courseId}`}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Course
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">{quiz.title}</h1>
              {quiz.description && (
                <p className="mt-0.5 text-sm text-muted-foreground">{quiz.description}</p>
              )}
            </div>

            {/* Timer */}
            {timeRemaining !== null && (
              <Badge
                variant={isTimeLow ? 'destructive' : 'secondary'}
                className="shrink-0 gap-1.5 px-3 py-1.5 text-sm tabular-nums"
              >
                <Clock className="h-3.5 w-3.5" />
                {formatTime(timeRemaining)}
              </Badge>
            )}
          </div>

          {/* Overall progress */}
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{answeredCount} of {totalQuestions} answered</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        {/* Question card */}
        <Card>
          <CardHeader className="pb-2">
            {/* Question dot navigation */}
            <div className="flex flex-wrap gap-1.5">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-7 w-7 rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    idx === currentIndex
                      ? 'bg-primary text-primary-foreground'
                      : answers[q.id]
                        ? 'bg-primary/20 text-primary hover:bg-primary/30'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  aria-label={`Go to question ${idx + 1}`}
                  aria-current={idx === currentIndex ? 'true' : undefined}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            {currentQuestion && (
              <QuizQuestion
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={handleAnswerChange}
                index={currentIndex + 1}
                total={totalQuestions}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation footer */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden xs:inline">Previous</span>
          </Button>

          <div className="flex gap-2">
            {currentIndex < totalQuestions - 1 ? (
              <Button onClick={handleNext} className="gap-1">
                <span className="hidden xs:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => setConfirmOpen(true)}
                disabled={submitQuiz.isPending}
                className="gap-2"
              >
                {submitQuiz.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Quiz
              </Button>
            )}
          </div>
        </div>

        {/* Submit error */}
        {submitQuiz.isError && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Failed to submit quiz. Please try again.</span>
          </div>
        )}
      </div>

      {/* Confirmation dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  You have answered{' '}
                  <strong>{answeredCount}</strong> of{' '}
                  <strong>{totalQuestions}</strong> questions.
                </p>
                {unansweredCount > 0 && (
                  <p className="text-yellow-600 dark:text-yellow-400">
                    ⚠️ {unansweredCount} question{unansweredCount > 1 ? 's are' : ' is'} unanswered.
                    Unanswered questions will be marked as incorrect.
                  </p>
                )}
                <p>Once submitted, you cannot change your answers.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Answers</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false)
                handleSubmit()
              }}
            >
              Submit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

/** Skeleton placeholder matching the QuizTaker layout */
export function QuizTakerSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-7 w-64" />
        <Skeleton className="mt-3 h-2 w-full" />
      </div>
      <Card>
        <CardHeader>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-7 w-7 rounded-full" />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-full" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  )
}
