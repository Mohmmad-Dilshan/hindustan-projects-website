import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/api'

/**
 * Fetch all active services (list view)
 */
export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then((r) => r.data),
    staleTime: 5 * 60 * 1000, // 5 min cache
  })
}

/**
 * Fetch single service by slug (detail view)
 */
export function useService(slug) {
  return useQuery({
    queryKey: ['services', slug],
    queryFn: () => api.get(`/services/${slug}`).then((r) => r.data),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  })
}
