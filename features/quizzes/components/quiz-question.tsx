'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { QuizQuestion } from '@/types'

interface QuizQuestionProps {
  question: QuizQuestion
  /** Current selected answerId (MC/TF) or text value (FILL_IN_BLANK) */
  value: string | undefined
  onChange: (value: string) => void
  /** 1-based index for display */
  index: number
  total: number
}

/**
 * Renders a single quiz question based on its type:
 * - MULTIPLE_CHOICE / TRUE_FALSE → RadioGroup of answer options
 * - FILL_IN_BLANK → plain text Input
 */
export function QuizQuestion({ question, value, onChange, index, total }: QuizQuestionProps) {
  const isFillInBlank = question.questionType === 'FILL_IN_BLANK'

  return (
    <div className="space-y-6">
      {/* Question header */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Question {index} of {total}
          {question.points > 1 && (
            <span className="ml-2 text-xs">({question.points} pts)</span>
          )}
        </p>
        <p className="text-base font-medium leading-relaxed">{question.question}</p>
      </div>

      {/* Answer input */}
      {isFillInBlank ? (
        <div className="space-y-2">
          <Label htmlFor={`fill-${question.id}`} className="sr-only">
            Your answer
          </Label>
          <Input
            id={`fill-${question.id}`}
            placeholder="Type your answer here…"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="max-w-md"
          />
        </div>
      ) : (
        <RadioGroup
          value={value ?? ''}
          onValueChange={onChange}
          className="space-y-3"
        >
          {(question.answers ?? []).map((answer) => (
            <div
              key={answer.id}
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
            >
              <RadioGroupItem value={answer.id} id={`answer-${answer.id}`} />
              <Label
                htmlFor={`answer-${answer.id}`}
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                {answer.answer}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  )
}
