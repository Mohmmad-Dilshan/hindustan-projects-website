/**
 * AdminBlogCommentsPage — Moderate blog comments
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, Check, X, Trash2, Search, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

export default function AdminBlogCommentsPage() {
  const [filter, setFilter] = useState('') // '' = all, 'false' = pending, 'true' = approved
  const [searchTerm, setSearchTerm] = useState('')
  const qc = useQueryClient()

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['admin-blog-comments', filter],
    queryFn: () => {
      const qs = filter !== '' ? `?approved=${filter}` : ''
      return api.get(`/admin/blog/comments${qs}`).then((r) => r.data)
    },
  })

  const approveMutation = useMutation({
    mutationFn: ({ id, isApproved }) => api.patch(`/admin/blog/comments/${id}/approve`, { isApproved }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog-comments'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/blog/comments/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog-comments'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  const filtered = comments.filter((c) => {
    if (!searchTerm) return true
    return (
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.blogPost?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const pendingCount = comments.filter((c) => !c.isApproved).length

  return (
    <>
      <SEO title="Blog Comments" noIndex />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900 flex items-center gap-2">
              Blog Comments
              {pendingCount > 0 && (
                <span className="text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  {pendingCount} pending
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500">Approve or reject reader comments before they appear publicly.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, email, comment or post..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all" />
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl border border-gray-150 shrink-0">
            {[
              { val: '', label: 'All' },
              { val: 'false', label: '⏳ Pending' },
              { val: 'true', label: '✓ Approved' },
            ].map((opt) => (
              <button key={opt.val} onClick={() => setFilter(opt.val)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${filter === opt.val ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl h-24 animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-14 bg-white border border-gray-100 rounded-2xl">
              <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No comments found.</p>
            </div>
          ) : (
            filtered.map((comment) => (
              <div key={comment.id}
                className={`bg-white rounded-xl border p-5 flex gap-4 items-start transition-all hover:shadow-sm ${!comment.isApproved ? 'border-amber-200 bg-amber-50/20' : 'border-gray-100'}`}>
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${comment.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {comment.name[0].toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">{comment.name}</span>
                    <span className="text-xs text-gray-400">{comment.email}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase ${comment.isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {comment.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>

                  {/* Post reference */}
                  {comment.blogPost && (
                    <div className="flex items-center gap-1 text-[11px] text-brand-blue mb-2">
                      <span className="text-gray-400">On:</span>
                      <Link to={`/blog/${comment.blogPost.slug}`} target="_blank"
                        className="font-semibold hover:underline flex items-center gap-0.5">
                        {comment.blogPost.title} <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 leading-relaxed">{comment.comment}</p>
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    {new Date(comment.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  {!comment.isApproved ? (
                    <button onClick={() => approveMutation.mutate({ id: comment.id, isApproved: true })}
                      disabled={approveMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  ) : (
                    <button onClick={() => approveMutation.mutate({ id: comment.id, isApproved: false })}
                      disabled={approveMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
                      <X className="w-3.5 h-3.5" /> Unapprove
                    </button>
                  )}
                  <button onClick={() => { if (window.confirm('Delete this comment?')) deleteMutation.mutate(comment.id) }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg text-xs font-semibold transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
