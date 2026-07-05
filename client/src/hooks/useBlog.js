import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/api'

export function useBlogPosts(filters = {}) {
  const params = new URLSearchParams()
  if (filters.page) params.set('page', filters.page)
  if (filters.limit) params.set('limit', filters.limit)
  if (filters.category) params.set('category', filters.category)
  if (filters.tag) params.set('tag', filters.tag)
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.search) params.set('search', filters.search)
  const qs = params.toString()

  return useQuery({
    queryKey: ['blog-posts', filters],
    queryFn: () => api.get(`/blog${qs ? `?${qs}` : ''}`),
    staleTime: 3 * 60 * 1000,
  })
}

export function useBlogPost(slug) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => api.get(`/blog/${slug}`),
    enabled: Boolean(slug),
    staleTime: 3 * 60 * 1000,
  })
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: () => api.get('/blog/categories'),
    staleTime: 10 * 60 * 1000,
  })
}

export function useBlogComments(slug) {
  return useQuery({
    queryKey: ['blog-comments', slug],
    queryFn: () => api.get(`/blog/${slug}/comments`),
    enabled: Boolean(slug),
    staleTime: 2 * 60 * 1000,
  })
}

export function useSubmitComment(slug) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post(`/blog/${slug}/comment`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog-comments', slug] }),
  })
}

// ── Admin hooks ────────────────────────────────────────────────

export function useAdminBlogPosts(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.category) params.set('category', filters.category)
  if (filters.search) params.set('search', filters.search)
  const qs = params.toString()

  return useQuery({
    queryKey: ['admin-blog-posts', filters],
    queryFn: () => api.get(`/admin/blog${qs ? `?${qs}` : ''}`),
    staleTime: 0,
  })
}

export function useAdminBlogPost(id) {
  return useQuery({
    queryKey: ['admin-blog-post', id],
    queryFn: () => api.get(`/admin/blog/${id}`),
    enabled: Boolean(id),
    staleTime: 0,
  })
}

export function useAdminComments(approved) {
  const qs = approved !== undefined ? `?approved=${approved}` : ''
  return useQuery({
    queryKey: ['admin-blog-comments', approved],
    queryFn: () => api.get(`/admin/blog/comments${qs}`),
    staleTime: 0,
  })
}
