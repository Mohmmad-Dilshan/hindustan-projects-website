/**
 * useClientPortal.js — React Query hooks for the Client Portal
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/api'

export function useClientMe() {
  return useQuery({
    queryKey: ['client-me'],
    queryFn: () => api.get('/client/me').then((r) => r.data),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useClientProjects() {
  return useQuery({
    queryKey: ['client-projects'],
    queryFn: () => api.get('/client/projects').then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  })
}

export function useClientProject(id) {
  return useQuery({
    queryKey: ['client-project', id],
    queryFn: () => api.get(`/client/projects/${id}`).then((r) => r.data),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  })
}

export function useClientLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (credentials) => api.post('/client/login', credentials),
    onSuccess: (res) => {
      qc.setQueryData(['client-me'], res.data)
      qc.invalidateQueries({ queryKey: ['client-projects'] })
    },
  })
}

export function useClientSetupPassword() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/client/setup-password', data),
    onSuccess: (res) => {
      qc.setQueryData(['client-me'], res.data)
      qc.invalidateQueries({ queryKey: ['client-projects'] })
    },
  })
}

export function useClientLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.post('/client/logout', {}),
    onSuccess: () => {
      qc.setQueryData(['client-me'], null)
      qc.clear()
    },
  })
}
