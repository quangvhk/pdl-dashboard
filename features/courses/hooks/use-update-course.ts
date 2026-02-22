'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesService } from '@/lib/api/services/courses.service'
import { coursesQueryKeys } from './use-courses'
import type { UpdateCourseRequest } from '@/types'

export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCourseRequest) => coursesService.update(courseId, data),
    onSuccess: (updatedCourse) => {
      // Update the detail cache directly
      queryClient.setQueryData(coursesQueryKeys.detail(courseId), updatedCourse)
      // Invalidate lists so they reflect the updated title/status
      queryClient.invalidateQueries({ queryKey: coursesQueryKeys.lists() })
    },
  })
}

export function usePublishCourse(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => coursesService.publish(courseId),
    onSuccess: (updatedCourse) => {
      queryClient.setQueryData(coursesQueryKeys.detail(courseId), updatedCourse)
      queryClient.invalidateQueries({ queryKey: coursesQueryKeys.lists() })
    },
  })
}

export function useArchiveCourse(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => coursesService.archive(courseId),
    onSuccess: (updatedCourse) => {
      queryClient.setQueryData(coursesQueryKeys.detail(courseId), updatedCourse)
      queryClient.invalidateQueries({ queryKey: coursesQueryKeys.lists() })
    },
  })
}

export function useDeleteCourse(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => coursesService.delete(courseId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: coursesQueryKeys.detail(courseId) })
      queryClient.invalidateQueries({ queryKey: coursesQueryKeys.lists() })
    },
  })
}
