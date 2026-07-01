import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/api'

export function useTeam() {
  return useQuery({
    queryKey: ['team'],
    queryFn: () => api.get('/team').then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  })
}
