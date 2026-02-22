'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { usersService } from '@/lib/api/services/users.service'
import { usersQueryKeys } from './use-users'
import type { CreateUserRequest } from '@/types'

export function useCreateUser() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersService.create(data),
    onSuccess: (user) => {
      // Invalidate the users list so it reflects the new user
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() })
      toast.success('User created!', {
        description: `${user.firstName} ${user.lastName} has been added to the platform.`,
      })
      // Navigate to the user detail page
      router.push(`/users/${user.id}`)
    },
    onError: (err) => {
      toast.error('Failed to create user', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
