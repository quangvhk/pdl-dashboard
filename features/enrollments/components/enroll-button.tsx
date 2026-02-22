'use client'

import { BookOpen, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEnroll } from '@/features/enrollments/hooks/use-enroll'

interface EnrollButtonProps {
  courseId: string
  /** Called after successful enrollment */
  onSuccess?: () => void
}

export function EnrollButton({ courseId, onSuccess }: EnrollButtonProps) {
  const { mutate: enroll, isPending } = useEnroll()

  const handleEnroll = () => {
    enroll({ courseId }, { onSuccess })
  }

  return (
    <Button onClick={handleEnroll} disabled={isPending} size="lg">
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enrolling…
        </>
      ) : (
        <>
          <BookOpen className="mr-2 h-4 w-4" />
          Enroll Now
        </>
      )}
    </Button>
  )
}
