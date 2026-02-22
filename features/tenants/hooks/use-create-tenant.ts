'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { tenantsService } from '@/lib/api/services/tenants.service'
import { tenantsQueryKeys } from './use-tenants'
import type { CreateTenantRequest } from '@/types'

export function useCreateTenant() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: CreateTenantRequest) => tenantsService.create(data),
    onSuccess: (tenant) => {
      // Invalidate the tenants list so it reflects the new tenant
      queryClient.invalidateQueries({ queryKey: tenantsQueryKeys.lists() })
      toast.success('Tenant created!', {
        description: `"${tenant.name}" has been created and is ready to use.`,
      })
      // Navigate to the tenant detail page
      router.push(`/tenants/${tenant.id}`)
    },
    onError: (err) => {
      toast.error('Failed to create tenant', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    },
  })
}
