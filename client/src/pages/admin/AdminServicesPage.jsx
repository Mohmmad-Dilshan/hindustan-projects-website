/**
 * Admin Services — Full CRUD with all ServiceDetailPage fields
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const ICON_OPTIONS = ['Globe','TrendingUp','Lightbulb','Code2','Star','Monitor','Smartphone','ShieldCheck','BarChart3','Megaphone','Layers','Settings']

function ServiceForm({ initial, onSave, onCancel, loading }) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const { register, handleSubmit } = useForm({
    defaultValues: initial ?? {
      title: '', slug: '', icon: 'Globe', order: 0, isActive: true,
      tag: '', deliveryTime: '',
      shortDescription: '', fullDescription: '',
      techStack: '', keyFeatures: '',
      process: '',
    },
  })

  const onSubmit = (data) => {
    onSave({
      ...data,
      order: Number(data.order) || 0,
      isActive: Boolean(data.isActive),
      techStack: data.techStack ? data.techStack.split('\n').map(t => t.trim()).filter(Boolean) : [],
      keyFeatures: data.keyFeatures ? data.keyFeatures.split('\n').map(t => t.trim()).filter(Boolean) : [],
      process: data.process ? (() => {
        try { return JSON.parse(data.process) } catch { return [] }
      })() : [],
    })
  }

  const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Basic fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Title *</label>
          <input {...register('title', { required: true })} className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Slug * <span className="text-gray-400 font-normal">(URL path)</span></label>
          <input {...register('slug', { required: true })} placeholder="web-development" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Icon <span className="text-gray-400 font-normal">(Lucide name)</span></label>
          <select {...register('icon')} className={inputCls}>
            {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Order</label>
          <input type="number" {...register('order')} className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Tag <span className="text-gray-400 font-normal">(e.g. Most Popular)</span></label>
          <input {...register('tag')} placeholder="Most Popular" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Delivery Time</label>
          <input {...register('deliveryTime')} placeholder="2–4 Weeks" className={inputCls} />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Short Description * <span className="text-gray-400 font-normal">(shown on cards)</span></label>
        <input {...register('shortDescription', { required: true })} className={inputCls} />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Full Description * <span className="text-gray-400 font-normal">(service detail page overview)</span></label>
        <textarea rows={3} {...register('fullDescription', { required: true })} className={`${inputCls} resize-none`} />
      </div>

      {/* Advanced toggle */}
      <button type="button" onClick={() => setShowAdvanced(v => !v)}
        className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors">
        {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {showAdvanced ? 'Hide' : 'Show'} Advanced Fields (Key Features, Tech Stack, Process)
      </button>

      {showAdvanced && (
        <div className="space-y-3 pl-3 border-l-2 border-brand-blue/20">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Key Features <span className="text-gray-400 font-normal">(one per line, shown as bullet points)</span>
            </label>
            <textarea rows={5} {...register('keyFeatures')}
              placeholder={'Fully responsive on all devices\nSEO-optimised from day one\nFast loading — under 3 seconds'}
              className={`${inputCls} resize-none font-mono text-xs`} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Tech Stack <span className="text-gray-400 font-normal">(one per line)</span>
            </label>
            <textarea rows={4} {...register('techStack')}
              placeholder={'React.js\nNode.js\nPostgreSQL'}
              className={`${inputCls} resize-none font-mono text-xs`} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Process Steps <span className="text-gray-400 font-normal">(JSON array)</span>
            </label>
            <textarea rows={6} {...register('process')}
              placeholder={'[\n  {"step":"01","title":"Discovery","desc":"We understand your goals."},\n  {"step":"02","title":"Design","desc":"We create prototypes."}\n]'}
              className={`${inputCls} resize-none font-mono text-xs`} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <input type="checkbox" id="svcActive" {...register('isActive')} className="rounded" />
        <label htmlFor="svcActive" className="text-sm text-gray-600">Active (visible on website)</label>
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors disabled:opacity-60">
          <Check className="w-4 h-4" /> Save Service
        </button>
        <button type="button" onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </form>
  )
}

export default function AdminServicesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const qc = useQueryClient()

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => api.get('/admin/services').then(r => r.data),
  })

  const prepareForEdit = (s) => ({
    ...s,
    techStack: Array.isArray(s.techStack) ? s.techStack.join('\n') : '',
    keyFeatures: Array.isArray(s.keyFeatures) ? s.keyFeatures.join('\n') : '',
    process: s.process ? JSON.stringify(s.process, null, 2) : '',
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/services', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); setShowForm(false) },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/admin/services/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); setEditing(null) },
  })
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/services/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-services'] }),
  })

  return (
    <>
      <SEO title="Services" noIndex />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Services</h1>
            <p className="text-sm text-gray-500 mt-1">Manage IT services — shown on Services page and Service Detail pages.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors">
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-heading text-base font-semibold text-gray-800 mb-4">New Service</h3>
            <ServiceForm onSave={createMutation.mutate} onCancel={() => setShowForm(false)} loading={createMutation.isPending} />
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
              </div>
            ))
          ) : services.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">No services yet. Add your first service.</p>
          ) : services.map(s => (
            <div key={s.id}>
              {editing?.id === s.id ? (
                <div className="p-5">
                  <ServiceForm
                    initial={prepareForEdit(editing)}
                    onSave={(data) => updateMutation.mutate({ id: s.id, ...data })}
                    onCancel={() => setEditing(null)}
                    loading={updateMutation.isPending}
                  />
                </div>
              ) : (
                <div className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400 font-mono w-5">{s.order}</span>
                      <span className="font-medium text-gray-900 text-sm">{s.title}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-mono">{s.icon}</span>
                      {s.tag && <span className="text-xs px-1.5 py-0.5 rounded-full bg-brand-red/10 text-brand-red font-medium">{s.tag}</span>}
                      {s.deliveryTime && <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-50 text-green-700">{s.deliveryTime}</span>}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{s.shortDescription}</p>
                    {s.keyFeatures?.length > 0 && (
                      <p className="text-xs text-gray-300 mt-0.5">{s.keyFeatures.length} features · {s.techStack?.length || 0} tech · {Array.isArray(s.process) ? s.process.length : 0} steps</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setEditing(s)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (window.confirm('Delete this service?')) deleteMutation.mutate(s.id) }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Help card */}
        <div className="bg-brand-blue/3 border border-brand-blue/15 rounded-xl p-4">
          <p className="text-xs font-semibold text-brand-blue mb-1">Icon names (Lucide)</p>
          <p className="text-xs text-text-muted">Available: {ICON_OPTIONS.join(', ')}</p>
          <p className="text-xs text-text-muted mt-1">Process JSON format: <code className="bg-white px-1 rounded">[{'{'}step,title,desc{'}'}]</code></p>
        </div>
      </div>
    </>
  )
}
