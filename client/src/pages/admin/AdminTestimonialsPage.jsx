/**
 * Admin Testimonials — CRUD
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X, Check, Star, MessageSquareQuote } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const inputCls = 'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all'

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-rose-500',
  'bg-amber-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-pink-500',
]
function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  )
}

function TestimonialForm({ initial, onSave, onCancel, loading }) {
  const { register, handleSubmit } = useForm({
    defaultValues: initial ?? { name: '', role: '', company: '', text: '', rating: 5, order: 0, isActive: true },
  })

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Client Information</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Client Name <span className="text-red-400">*</span></label>
            <input {...register('name', { required: true })} className={inputCls} placeholder="John Smith" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Role <span className="text-red-400">*</span></label>
            <input {...register('role', { required: true })} placeholder="CEO" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Company <span className="text-red-400">*</span></label>
            <input {...register('company', { required: true })} className={inputCls} placeholder="Acme Corp" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Review Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Rating (1–5)</label>
            <input type="number" min="1" max="5" {...register('rating', { valueAsNumber: true })} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Display Order</label>
            <input type="number" {...register('order', { valueAsNumber: true })} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Avatar URL <span className="text-gray-400 font-normal">(optional)</span></label>
            <input {...register('avatarUrl')} placeholder="https://..." className={inputCls} />
          </div>
        </div>
        <div className="mt-3">
          <label className="text-xs font-semibold text-gray-600 block mb-1.5">Review Text <span className="text-red-400">*</span></label>
          <textarea rows={3} {...register('text', { required: true })}
            className={`${inputCls} resize-none`}
            placeholder="Share what the client said about working with you..." />
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <input type="checkbox" id="tActive" {...register('isActive')}
          className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue/25 cursor-pointer" />
        <label htmlFor="tActive" className="text-sm text-gray-600 cursor-pointer">Show on website</label>
      </div>

      <div className="flex gap-2.5 pt-1 border-t border-gray-100">
        <button type="submit" disabled={loading}
          className="flex items-center gap-1.5 bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all disabled:opacity-60">
          <Check className="w-4 h-4" /> Save Review
        </button>
        <button type="button" onClick={onCancel}
          className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </form>
  )
}

export default function AdminTestimonialsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const qc = useQueryClient()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => api.get('/admin/testimonials').then(r => r.data),
  })

  const createM = useMutation({
    mutationFn: (d) => api.post('/admin/testimonials', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); setShowForm(false) },
  })

  const updateM = useMutation({
    mutationFn: ({ id, ...d }) => api.patch(`/admin/testimonials/${id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); setEditing(null) },
  })

  const deleteM = useMutation({
    mutationFn: (id) => api.delete(`/admin/testimonials/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-testimonials'] }),
  })

  return (
    <>
      <SEO title="Testimonials" noIndex />
      <div className="space-y-6">

        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
              <MessageSquareQuote className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">Testimonials</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage client reviews shown on the website.</p>
            </div>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null) }}
            className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-md transition-all shrink-0">
            <Plus className="w-4 h-4" /> Add Review
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white border border-blue-100 border-l-4 border-l-brand-blue rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5 text-brand-blue" />
              </div>
              <h3 className="font-heading text-base font-semibold text-gray-800">New Testimonial</h3>
            </div>
            <TestimonialForm onSave={createM.mutate} onCancel={() => setShowForm(false)} loading={createM.isPending} />
          </div>
        )}

        {/* Testimonials List */}
        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4 animate-pulse">
                <div className="w-11 h-11 bg-gray-100 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-xl py-16 flex flex-col items-center gap-3">
              <MessageSquareQuote className="w-12 h-12 text-gray-200" />
              <p className="font-semibold text-gray-700">No testimonials yet</p>
              <p className="text-sm text-gray-400">Add client reviews to build trust with visitors.</p>
            </div>
          ) : items.map(t => (
            <div key={t.id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              {editing?.id === t.id ? (
                <div className="p-6 border-l-4 border-l-brand-blue rounded-xl">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                      <Pencil className="w-3.5 h-3.5 text-brand-blue" />
                    </div>
                    <h3 className="font-heading text-base font-semibold text-gray-800">Edit: {t.name}</h3>
                  </div>
                  <TestimonialForm
                    initial={t}
                    onSave={(d) => updateM.mutate({ id: t.id, ...d })}
                    onCancel={() => setEditing(null)}
                    loading={updateM.isPending}
                  />
                </div>
              ) : (
                <div className="p-4 flex items-start gap-4">
                  {/* Avatar */}
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.name}
                      className="w-11 h-11 rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
                      loading="lazy" />
                  ) : (
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${getAvatarColor(t.name)} shadow-sm`}>
                      <span className="text-white font-bold text-sm">
                        {t.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{t.name}</span>
                      <span className="text-xs text-gray-400">{t.role}, {t.company}</span>
                      {!t.isActive && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 border border-gray-200 rounded-full">Hidden</span>
                      )}
                    </div>
                    <StarRating rating={t.rating} />
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 italic">&ldquo;{t.text}&rdquo;</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => { setEditing(t); setShowForm(false) }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-brand-blue/8 transition-all">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (window.confirm('Delete?')) deleteM.mutate(t.id) }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
