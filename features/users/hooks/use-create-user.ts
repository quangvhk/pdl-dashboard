'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
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
      // Navigate to the user detail page
      router.push(`/users/${user.id}`)
    },
  })
}
