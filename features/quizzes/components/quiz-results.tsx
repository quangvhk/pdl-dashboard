'use client'

import Link from 'next/link'
import { CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuizAttempts } from '../hooks/use-quiz-attempts'
import type { Quiz, QuizAttempt } from '@/types'

interface QuizResultsProps {
  quiz: Quiz
  attempt: QuizAttempt
  courseId: string
  /** Called when the user wants to retake the quiz */
  onRetake: () => void
}

/**
 * Displays the graded result of a quiz attempt.
 * Shows score, pass/fail status, passing threshold, and attempt history.
 */
export function QuizResults({ quiz, attempt, courseId, onRetake }: QuizResultsProps) {
  const { data: attempts, isLoading: attemptsLoading } = useQuizAttempts(quiz.id)

  const percentage = attempt.maxScore > 0
    ? Math.round((attempt.score / attempt.maxScore) * 100)
    : 0

  const passingPercentage = quiz.passingScore

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      {/* Score card */}
      <Card className="overflow-hidden">
        <div className={`h-2 ${attempt.passed ? 'bg-green-500' : 'bg-destructive'}`} />
        <CardHeader className="pb-2 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            {attempt.passed ? (
              <Trophy className="h-8 w-8 text-yellow-500" />
            ) : (
              <XCircle className="h-8 w-8 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {attempt.passed ? 'Congratulations!' : 'Not Quite There'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {attempt.passed
              ? 'You passed the quiz!'
              : `You need ${passingPercentage}% to pass. Keep studying and try again!`}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score display */}
          <div className="rounded-lg border bg-muted/30 p-6 text-center">
            <p className="text-5xl font-bold tabular-nums">
              {percentage}
              <span className="text-2xl text-muted-foreground">%</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {attempt.score} / {attempt.maxScore} points
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your score</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <Progress
              value={percentage}
              className={attempt.passed ? '[&>div]:bg-green-500' : '[&>div]:bg-destructive'}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className="flex items-center gap-1">
                <span>Passing: {passingPercentage}%</span>
              </span>
              <span>100%</span>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex justify-center">
            {attempt.passed ? (
              <Badge className="gap-1.5 bg-green-500 px-4 py-1.5 text-sm hover:bg-green-600">
                <CheckCircle2 className="h-4 w-4" />
                PASSED
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1.5 px-4 py-1.5 text-sm">
                <XCircle className="h-4 w-4" />
                FAILED
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attempt history */}
      {(attemptsLoading || (attempts && attempts.length > 1)) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Attempt History</CardTitle>
          </CardHeader>
          <CardContent>
            {attemptsLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {(attempts ?? [])
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
                  )
                  .map((att, idx) => {
                    const pct =
                      att.maxScore > 0
                        ? Math.round((att.score / att.maxScore) * 100)
                        : 0
                    const isLatest = att.id === attempt.id
                    return (
                      <div
                        key={att.id}
                        className={`flex items-center justify-between rounded-md border px-4 py-2 text-sm ${
                          isLatest ? 'border-primary bg-primary/5' : ''
                        }`}
                      >
                        <span className="text-muted-foreground">
                          Attempt {(attempts?.length ?? 0) - idx}
                          {isLatest && (
                            <span className="ml-2 text-xs text-primary">(latest)</span>
                          )}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-medium tabular-nums">{pct}%</span>
                          {att.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseId}`}>← Back to Course</Link>
        </Button>
        {!attempt.passed && (
          <Button onClick={onRetake} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}

/** Skeleton placeholder matching the QuizResults layout */
export function QuizResultsSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <Card>
        <Skeleton className="h-2 w-full" />
        <CardHeader className="pb-2 text-center">
          <Skeleton className="mx-auto h-16 w-16 rounded-full" />
          <Skeleton className="mx-auto mt-3 h-7 w-48" />
          <Skeleton className="mx-auto mt-2 h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mx-auto h-8 w-24 rounded-full" />
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  )
}
