import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'
import { useToast } from '@/components/ui/ToastProvider'
import {
  Share2,
  Copy,
  Check,
  Trash2,
  CheckCircle2,
  Circle,
  Plus,
  X,
  Search,
  FolderKanban,
  Calendar,
  Eye,
  Sparkles,
  Send,
  Tag,
  Clock,
  ThumbsUp,
  MessageSquare,
  Repeat,
  Bookmark,
} from 'lucide-react'

const PLATFORMS = [
  { id: 'ALL', label: 'All Platforms', badgeCls: 'bg-gray-100 text-gray-700 border-gray-200' },
  { id: 'LINKEDIN', label: 'LinkedIn', badgeCls: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'TWITTER', label: 'X / Twitter', badgeCls: 'bg-slate-100 text-slate-800 border-slate-300' },
  { id: 'INSTAGRAM', label: 'Instagram', badgeCls: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'FACEBOOK', label: 'Facebook', badgeCls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
]

const STATUSES = ['ALL', 'DRAFT', 'SCHEDULED', 'POSTED']

export default function AdminSocialDraftsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [copiedId, setCopiedId] = useState(null)
  const [platformFilter, setPlatformFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [previewDraft, setPreviewDraft] = useState(null)

  // Form states for manual draft creation
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('ALL')
  const [campaignName, setCampaignName] = useState('')
  const [scheduledFor, setScheduledFor] = useState('')
  const [draftText, setDraftText] = useState('')

  // Fetch social drafts
  const { data: draftsRes, isLoading } = useQuery({
    queryKey: ['social-drafts'],
    queryFn: () => api.get('/admin/social/drafts').then((r) => r.data.data),
  })

  // Fetch portfolio projects for selection
  const { data: projectsRes } = useQuery({
    queryKey: ['admin-portfolio-projects'],
    queryFn: () => api.get('/projects').then((r) => r.data.data),
  })

  const drafts = draftsRes || []
  const projects = projectsRes || []

  // Mutation to toggle status
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/social/drafts/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-drafts'] })
      toast.success('Social post status updated!')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update status.')
    },
  })

  // Mutation to delete a draft
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/social/drafts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-drafts'] })
      toast.success('Social post deleted.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete post.')
    },
  })

  // Mutation to create a new social draft
  const createMutation = useMutation({
    mutationFn: (newDraft) => api.post('/admin/social/drafts', newDraft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-drafts'] })
      toast.success('New social campaign draft created successfully!')
      setIsAddModalOpen(false)
      setSelectedProjectId('')
      setSelectedPlatform('ALL')
      setCampaignName('')
      setScheduledFor('')
      setDraftText('')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create social draft.')
    },
  })

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Post text & hashtags copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2500)
  }

  const handleCreate = (e) => {
    e.preventDefault()
    if (!draftText.trim()) return
    createMutation.mutate({
      projectId: selectedProjectId || null,
      platform: selectedPlatform,
      campaignName: campaignName.trim() || null,
      scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : null,
      text: draftText.trim(),
      status: scheduledFor ? 'SCHEDULED' : 'DRAFT',
    })
  }

  // Auto-generate caption template from project
  const handleAutoGenerateCaption = (projId) => {
    const proj = projects.find((p) => p.id === projId)
    if (!proj) return
    const tags = proj.technologies ? proj.technologies.map((t) => `#${t.replace(/\s+/g, '')}`).join(' ') : ''
    const template = `🚀 Project Showcase: ${proj.title}\n\nClient: ${proj.clientName}\nCategory: ${proj.category}\n\n${proj.description}\n\nKey Stack: ${proj.technologies?.join(', ')}\n\n✨ Built & Delivered by Hindustan Projects team.\n🌐 Learn more: https://itservices.hindustanprojects.in/portfolio\n\n#HindustanProjects #${proj.category.replace(/\s+/g, '')} ${tags}`
    setDraftText(template)
  }

  // Filter drafts based on search term, platform, and status tab
  const filteredDrafts = drafts.filter((draft) => {
    const matchesPlatform = platformFilter === 'ALL' || draft.platform === platformFilter
    const matchesStatus = statusFilter === 'ALL' || draft.status === statusFilter
    const projectTitle = draft.project?.title?.toLowerCase() || ''
    const campaignStr = draft.campaignName?.toLowerCase() || ''
    const textContent = draft.text?.toLowerCase() || ''
    const s = searchTerm.toLowerCase()
    const matchesSearch = projectTitle.includes(s) || campaignStr.includes(s) || textContent.includes(s)

    return matchesPlatform && matchesStatus && matchesSearch
  })

  return (
    <>
      <SEO title="Social Marketing Suite" noIndex />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
              <Share2 className="w-6 h-6 text-brand-blue" />
              Social Marketing Suite
            </h1>
            <p className="text-sm text-gray-500">
              Enterprise digital marketing hub — draft, schedule, and preview social media campaigns across platforms.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-brand-blue text-white px-4.5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-brand-blue/10 hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Campaign Post
          </button>
        </div>

        {/* Toolbar, Platform Filters & Status Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
            {/* Platform Filter Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatformFilter(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    platformFilter === p.id
                      ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search captions or campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              />
            </div>
          </div>

          {/* Status Sub-filter */}
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium pt-1">
            <span>Status Filter:</span>
            {STATUSES.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Drafts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm animate-pulse space-y-4">
                <div className="h-4 bg-gray-150 rounded w-1/3" />
                <div className="h-24 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredDrafts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <Share2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">No social post campaigns found</p>
            <p className="text-xs text-gray-400 mt-1">Try updating your platform filters or create a new campaign post.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDrafts.map((draft) => {
              const platformObj = PLATFORMS.find((p) => p.id === draft.platform) || PLATFORMS[0]
              return (
                <div
                  key={draft.id}
                  className="p-5 rounded-2xl border border-gray-200 transition-all duration-200 flex flex-col justify-between shadow-sm bg-white hover:border-gray-300"
                >
                  <div>
                    {/* Card Header: Platform Badge + Campaign Tag + Status */}
                    <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${platformObj.badgeCls}`}>
                          {platformObj.label}
                        </span>
                        {draft.campaignName && (
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" />
                            {draft.campaignName}
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                          draft.status === 'POSTED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : draft.status === 'SCHEDULED'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {draft.status}
                      </span>
                    </div>

                    {/* Linked Project info */}
                    {draft.project && (
                      <p className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1">
                        <FolderKanban className="w-3.5 h-3.5 text-brand-blue" />
                        {draft.project.title} <span className="text-gray-400 font-normal">({draft.project.category})</span>
                      </p>
                    )}

                    {/* Caption Preview box */}
                    <pre className="text-xs text-gray-700 bg-gray-50 p-4 rounded-xl font-mono whitespace-pre-wrap max-h-[160px] overflow-y-auto mb-4 border border-gray-150 leading-relaxed">
                      {draft.text}
                    </pre>

                    {/* Schedule timestamp if present */}
                    {draft.scheduledFor && (
                      <p className="text-[11px] text-blue-600 font-semibold mb-3 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Scheduled for: {new Date(draft.scheduledFor).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto flex-wrap gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewDraft(draft)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-brand-blue transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Feed</span>
                      </button>
                      <button
                        onClick={() =>
                          statusMutation.mutate({
                            id: draft.id,
                            status: draft.status === 'POSTED' ? 'DRAFT' : 'POSTED',
                          })
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        {draft.status === 'POSTED' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Circle className="w-3.5 h-3.5" />
                        )}
                        <span>{draft.status === 'POSTED' ? 'Posted' : 'Mark Posted'}</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this campaign post?')) {
                            deleteMutation.mutate(draft.id)
                          }
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleCopy(draft.id, draft.text)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      {copiedId === draft.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === draft.id ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Create Campaign Post Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                <h3 className="text-base font-bold text-gray-900 font-heading flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-brand-blue" />
                  Create Social Marketing Post
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Platform selection */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                      Target Social Platform
                    </label>
                    <select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Campaign Name */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                      Campaign Name <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Summer Promo 2026"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </div>
                </div>

                {/* Project Link & Template Auto Generator */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 block">
                      Link Portfolio Project
                    </label>
                    {selectedProjectId && (
                      <button
                        type="button"
                        onClick={() => handleAutoGenerateCaption(selectedProjectId)}
                        className="text-[11px] text-brand-blue hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" /> Auto-fill Template
                      </button>
                    )}
                  </div>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => {
                      setSelectedProjectId(e.target.value)
                      if (e.target.value) handleAutoGenerateCaption(e.target.value)
                    }}
                    className="w-full text-xs font-semibold px-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="">-- General Marketing Post (No Project Link) --</option>
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.title} ({proj.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scheduled DateTime */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                    Schedule Release Date <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                {/* Caption / Text */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                    Post Caption & Hashtags *
                  </label>
                  <textarea
                    rows={6}
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    placeholder="🔥 Excited to share our new service launch at Hindustan Projects! #webdevelopment #digitalmarketing"
                    required
                    className="w-full text-xs text-gray-700 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-150">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-gray-250 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || !draftText.trim()}
                    className="px-5 py-2 bg-brand-blue hover:bg-blue-700 disabled:bg-gray-300 text-white text-xs font-semibold rounded-xl hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {createMutation.isPending ? 'Saving...' : 'Save Campaign Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Platform Live Feed Preview Modal */}
        {previewDraft && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                <h3 className="text-sm font-bold text-gray-900 font-heading flex items-center gap-2">
                  <Eye className="w-4 h-4 text-brand-blue" />
                  Feed Preview Card
                </h3>
                <button
                  onClick={() => setPreviewDraft(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Feed Card UI */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">
                    HP
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Hindustan Projects</p>
                    <p className="text-[10px] text-gray-400">IT Services & Digital Agency • Promoted</p>
                  </div>
                </div>

                <p className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {previewDraft.text}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-gray-400 text-xs">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> Like</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> Comment</span>
                  <span className="flex items-center gap-1"><Repeat className="w-3.5 h-3.5" /> Repost</span>
                  <span className="flex items-center gap-1"><Send className="w-3.5 h-3.5" /> Share</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setPreviewDraft(null)}
                  className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
