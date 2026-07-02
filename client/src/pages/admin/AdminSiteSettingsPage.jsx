import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { CheckCircle2, AlertCircle, Phone, MessageCircle, Mail, MapPin, Type, Settings } from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const LinkedinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const InstagramIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const FacebookIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const FIELD_GROUPS = [
  {
    label: 'Contact Details',
    fields: [
      { key: 'phone',   label: 'Phone Number',   placeholder: '+91 99999 99999', Icon: Phone },
      { key: 'whatsapp', label: 'WhatsApp Number', placeholder: '+91 99999 99999', Icon: MessageCircle },
      { key: 'email',   label: 'Email Address',  placeholder: 'info@hindustanprojects.com', Icon: Mail },
      { key: 'address', label: 'Office Address', placeholder: 'Bhilwara, Rajasthan 311001, India', Icon: MapPin },
    ],
  },
  {
    label: 'Social Media',
    fields: [
      { key: 'linkedin',  label: 'LinkedIn URL',  placeholder: 'https://linkedin.com/company/...', Icon: LinkedinIcon },
      { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...', Icon: InstagramIcon },
      { key: 'facebook',  label: 'Facebook URL',  placeholder: 'https://facebook.com/...', Icon: FacebookIcon },
    ],
  },
  {
    label: 'Branding',
    fields: [
      { key: 'tagline', label: 'Hero Tagline', placeholder: 'Building Digital Solutions...', Icon: Type },
    ],
  },
]

const inputCls = 'w-full pl-9 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all'

export default function AdminSiteSettingsPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => api.get('/settings').then(r => r.data),
  })

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  useEffect(() => {
    if (data?.data) reset(data.data)
  }, [data, reset])

  const mutation = useMutation({
    mutationFn: d => api.patch('/admin/settings', d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-settings'] }),
  })

  const onSubmit = d => mutation.mutate(d)

  return (
    <>
      <SEO title="Site Settings" noIndex />
      <div className="space-y-6 max-w-2xl">

        {/* Page Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Site Settings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Contact info, social links, and tagline — shown across the website.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {FIELD_GROUPS.map(group => (
              <div key={group.label} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                {/* Group Header */}
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{group.label}</p>
                </div>

                {/* Fields */}
                <div className="p-5 space-y-4">
                  {group.fields.map(f => (
                    <div key={f.key}>
                      <label className="text-xs font-semibold text-gray-600 block mb-1.5">{f.label}</label>
                      <div className="relative">
                        <f.Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        <input
                          {...register(f.key)}
                          placeholder={f.placeholder}
                          className={inputCls}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Status Messages */}
            {mutation.isSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Settings saved successfully.
              </div>
            )}
            {mutation.isError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" /> Failed to save settings.
              </div>
            )}

            <button type="submit" disabled={isSubmitting || mutation.isPending}
              className="w-full bg-brand-blue text-white font-semibold py-2.5 rounded-xl text-sm hover:shadow-md transition-all disabled:opacity-60">
              {mutation.isPending ? 'Saving…' : 'Save Settings'}
            </button>
          </form>
        )}
      </div>
    </>
  )
}
