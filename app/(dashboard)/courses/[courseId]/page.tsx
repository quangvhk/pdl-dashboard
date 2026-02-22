'use client'

import { use } from 'react'
import { CourseDetail } from '@/features/courses/components/course-detail'

interface CourseDetailPageProps {
  params: Promise<{ courseId: string }>
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseId } = use(params)

  return <CourseDetail courseId={courseId} />
}
