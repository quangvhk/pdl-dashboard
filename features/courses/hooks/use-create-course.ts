'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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
      toast.success('Course created!', {
        description: `"${course.title}" has been created. Add sections and lessons to get started.`,
      })
      // Navigate to the course editor to add sections/lessons
      router.push(`/courses/${course.id}/edit`)
    },
    onError: (err) => {
      toast.error('Failed to create course', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
