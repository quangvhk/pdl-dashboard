'use client'

import { use } from 'react'
import { LessonViewer } from '@/features/courses/components/lesson-viewer'

interface LessonPageProps {
  params: Promise<{
    courseId: string
    sectionId: string
    lessonId: string
  }>
}

export default function LessonPage({ params }: LessonPageProps) {
  const { courseId, sectionId, lessonId } = use(params)

  return (
    <LessonViewer courseId={courseId} sectionId={sectionId} lessonId={lessonId} />
  )
}
