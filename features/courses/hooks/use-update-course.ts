'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
      toast.success('Course updated', {
        description: `"${updatedCourse.title}" has been saved.`,
      })
    },
    onError: (err) => {
      toast.error('Failed to update course', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
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
      toast.success('Course published!', {
        description: `"${updatedCourse.title}" is now live and visible to students.`,
      })
    },
    onError: (err) => {
      toast.error('Failed to publish course', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
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
      toast.success('Course archived', {
        description: `"${updatedCourse.title}" has been archived and is no longer visible to students.`,
      })
    },
    onError: (err) => {
      toast.error('Failed to archive course', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
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
      toast.success('Course deleted', {
        description: 'The course has been permanently deleted.',
      })
    },
    onError: (err) => {
      toast.error('Failed to delete course', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
