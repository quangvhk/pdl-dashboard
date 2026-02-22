'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { coursesService } from '@/lib/api/services/courses.service'
import { coursesQueryKeys } from './use-courses'
import type { CreateCourseRequest } from '@/types'

export function useCreateCourse() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: CreateCourseRequest) => coursesService.create(data),
    onSuccess: (course) => {
      // Invalidate the courses list so it reflects the new course
      queryClient.invalidateQueries({ queryKey: coursesQueryKeys.lists() })
      // Navigate to the course editor to add sections/lessons
      router.push(`/courses/${course.id}/edit`)
    },
  })
}
