/**
 * AdminIntegrationPage — Manage third-party API keys & service credentials
 * Cloudinary, SMTP Email, Google reCAPTCHA
 * Only accessible to SUPER_ADMIN role.
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  Cloud, Mail, ShieldCheck, Eye, EyeOff, CheckCircle2,
  AlertCircle, Loader2, Plug, TestTube2, ExternalLink,
  RefreshCw, Lock, Info,
} from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

// ── Helper: masked input field ────────────────────────────────
function SecretInput({ label, name, placeholder, register, description }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
      {description && (
        <p className="text-[11px] text-gray-400 mb-1.5 leading-relaxed">{description}</p>
      )}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          {...register(name)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl
            bg-gray-50 focus:bg-white focus:outline-none focus:ring-2
            focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-mono"
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={show ? 'Hide' : 'Show'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

function PlainInput({ label, name, placeholder, register, description, type = 'text' }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
      {description && (
        <p className="text-[11px] text-gray-400 mb-1.5 leading-relaxed">{description}</p>
      )}
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl
          bg-gray-50 focus:bg-white focus:outline-none focus:ring-2
          focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
      />
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      Configured
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
      Not Set
    </span>
  )
}

// ── Section card wrapper ──────────────────────────────────────
function Section({ icon: Icon, title, badge, accentColor = 'brand-blue', children }) {
  const accent = {
    'brand-blue':  'border-l-brand-blue bg-brand-blue/5',
    'violet':      'border-l-violet-500 bg-violet-50/40',
    'emerald':     'border-l-emerald-500 bg-emerald-50/40',
    'orange':      'border-l-orange-500 bg-orange-50/40',
  }[accentColor] || 'border-l-brand-blue bg-brand-blue/5'

  return (
    <div className={`bg-white border border-gray-100 border-l-4 rounded-xl shadow-sm overflow-hidden ${accent}`}>
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center">
            <Icon className="w-4 h-4 text-gray-600" />
          </div>
          <h2 className="font-heading text-base font-bold text-gray-800">{title}</h2>
        </div>
        {badge}
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

// ── Test button ───────────────────────────────────────────────
function TestButton({ label, onClick, loading, result }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-brand-blue/30 text-brand-blue hover:bg-brand-blue/5 transition-all disabled:opacity-60"
      >
        {loading
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <TestTube2 className="w-3.5 h-3.5" />}
        {label}
      </button>
      {result && (
        <span className={`text-xs font-medium flex items-center gap-1 ${result.ok ? 'text-emerald-600' : 'text-red-500'}`}>
          {result.ok
            ? <CheckCircle2 className="w-3.5 h-3.5" />
            : <AlertCircle className="w-3.5 h-3.5" />}
          {result.message}
        </span>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function AdminIntegrationPage() {
  const qc = useQueryClient()
  const [saveStatus, setSaveStatus] = useState(null)
  const [smtpTest, setSmtpTest] = useState(null)
  const [smtpTesting, setSmtpTesting] = useState(false)
  const [cloudTest, setCloudTest] = useState(null)
  const [cloudTesting, setCloudTesting] = useState(false)

  // Fetch current config
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-integrations'],
    queryFn: () => api.get('/admin/integrations').then(r => r.data),
  })

  const status = data?._status || {}

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    values: data ? {
      sys_cloudinary_cloud_name: data.sys_cloudinary_cloud_name || '',
      sys_cloudinary_api_key:    data.sys_cloudinary_api_key    || '',
      sys_cloudinary_api_secret: data.sys_cloudinary_api_secret || '',
      sys_smtp_host:  data.sys_smtp_host  || '',
      sys_smtp_port:  data.sys_smtp_port  || '587',
      sys_smtp_user:  data.sys_smtp_user  || '',
      sys_smtp_pass:  data.sys_smtp_pass  || '',
      sys_smtp_from:  data.sys_smtp_from  || '',
      sys_recaptcha_secret_key: data.sys_recaptcha_secret_key || '',
    } : {},
  })

  const mutation = useMutation({
    mutationFn: d => api.patch('/admin/integrations', d),
    onSuccess: () => {
      setSaveStatus({ ok: true, message: 'All settings saved and applied to server.' })
      qc.invalidateQueries({ queryKey: ['admin-integrations'] })
      setTimeout(() => setSaveStatus(null), 5000)
    },
    onError: (err) => {
      setSaveStatus({ ok: false, message: err.message || 'Failed to save.' })
    },
  })

  const onSubmit = (d) => {
    setSaveStatus(null)
    mutation.mutate(d)
  }

  const handleSmtpTest = async () => {
    setSmtpTesting(true)
    setSmtpTest(null)
    try {
      const r = await api.post('/admin/integrations/test-smtp', {})
      setSmtpTest({ ok: true, message: r.message })
    } catch (err) {
      setSmtpTest({ ok: false, message: err.message })
    } finally {
      setSmtpTesting(false)
    }
  }

  const handleCloudinaryTest = async () => {
    setCloudTesting(true)
    setCloudTest(null)
    try {
      const r = await api.post('/admin/integrations/test-cloudinary', {})
      setCloudTest({ ok: true, message: r.message })
    } catch (err) {
      setCloudTest({ ok: false, message: err.message })
    } finally {
      setCloudTesting(false)
    }
  }

  return (
    <>
      <SEO title="Integration Settings" noIndex />
      <div className="space-y-6 max-w-3xl">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
              <Plug className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">Integration Settings</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage API keys for Cloudinary, Email (SMTP), and reCAPTCHA.
                Changes apply immediately — no server restart needed.
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-blue px-3 py-1.5 rounded-lg border border-gray-200 hover:border-brand-blue/30 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {/* Security notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800 mb-0.5">SUPER_ADMIN Only</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              These credentials are stored encrypted in your database and applied directly to the running server.
              Secret keys are masked on display. Leaving a field blank will not overwrite the existing saved value.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Failed to load integration settings. You may not have SUPER_ADMIN access.
          </div>
        )}

        {!isLoading && !isError && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* ── Cloudinary ── */}
            <Section
              icon={Cloud}
              title="Cloudinary — Image & File Storage"
              accentColor="violet"
              badge={<StatusBadge active={status.cloudinary} />}
            >
              <div className="bg-violet-50/50 border border-violet-100 rounded-lg p-3 flex items-start gap-2 text-xs text-violet-700">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Used for uploading project thumbnails, team photos, and resumes.
                  Get your credentials at{' '}
                  <a href="https://cloudinary.com/console" target="_blank" rel="noopener noreferrer"
                    className="underline font-semibold inline-flex items-center gap-0.5">
                    cloudinary.com/console <ExternalLink className="w-3 h-3" />
                  </a>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PlainInput
                  label="Cloud Name"
                  name="sys_cloudinary_cloud_name"
                  placeholder="e.g. my-cloud-name"
                  register={register}
                />
                <PlainInput
                  label="API Key"
                  name="sys_cloudinary_api_key"
                  placeholder="e.g. 445256788173392"
                  register={register}
                />
              </div>
              <SecretInput
                label="API Secret"
                name="sys_cloudinary_api_secret"
                placeholder="Leave blank to keep existing"
                register={register}
                description="Your Cloudinary API Secret. Stored encrypted. Leave blank to keep existing value."
              />

              <TestButton
                label="Test Cloudinary Connection"
                onClick={handleCloudinaryTest}
                loading={cloudTesting}
                result={cloudTest}
              />
            </Section>

            {/* ── SMTP Email ── */}
            <Section
              icon={Mail}
              title="Email (SMTP) — Contact Form & Notifications"
              accentColor="emerald"
              badge={<StatusBadge active={status.smtp} />}
            >
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 flex items-start gap-2 text-xs text-emerald-700">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Used to send lead notifications and auto-reply emails to clients.
                  For Gmail, use an{' '}
                  <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer"
                    className="underline font-semibold inline-flex items-center gap-0.5">
                    App Password <ExternalLink className="w-3 h-3" />
                  </a>
                  , not your main password.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <PlainInput
                    label="SMTP Host"
                    name="sys_smtp_host"
                    placeholder="smtp.gmail.com"
                    register={register}
                  />
                </div>
                <PlainInput
                  label="Port"
                  name="sys_smtp_port"
                  placeholder="587"
                  register={register}
                  type="number"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PlainInput
                  label="Email Username / Address"
                  name="sys_smtp_user"
                  placeholder="yourname@gmail.com"
                  register={register}
                />
                <SecretInput
                  label="Email Password / App Password"
                  name="sys_smtp_pass"
                  placeholder="Leave blank to keep existing"
                  register={register}
                />
              </div>

              <PlainInput
                label='From Name & Address (e.g. "Hindustan Projects <info@...>")'
                name="sys_smtp_from"
                placeholder={`"Hindustan Projects" <info@hindustanprojects.com>`}
                register={register}
                description="This appears as the sender name in email inboxes."
              />

              <TestButton
                label="Send Test Email"
                onClick={handleSmtpTest}
                loading={smtpTesting}
                result={smtpTest}
              />
            </Section>

            {/* ── reCAPTCHA ── */}
            <Section
              icon={ShieldCheck}
              title="Google reCAPTCHA v3 — Spam Protection"
              accentColor="orange"
              badge={<StatusBadge active={status.recaptcha} />}
            >
              <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-3 flex items-start gap-2 text-xs text-orange-700">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Protects the contact form from bots.
                  Get your keys at{' '}
                  <a href="https://www.google.com/recaptcha/admin" target="_blank" rel="noopener noreferrer"
    className="underline font-semibold inline-flex items-center gap-0.5">
                    google.com/recaptcha/admin <ExternalLink className="w-3 h-3" />
                  </a>.
                  Register your domain and choose reCAPTCHA v3.
                  The <strong>Site Key</strong> goes in your Vercel frontend env vars (VITE_RECAPTCHA_SITE_KEY).
                </span>
              </div>

              <SecretInput
                label="reCAPTCHA v3 Secret Key (Server-Side)"
                name="sys_recaptcha_secret_key"
                placeholder="Leave blank to keep existing"
                register={register}
                description="Used by the server to verify reCAPTCHA tokens. The site key must also be set in your Vercel/frontend environment variables."
              />

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
                <p className="font-semibold text-gray-700 mb-1">Frontend Site Key (Vercel env var)</p>
                <p>Add <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-xs">VITE_RECAPTCHA_SITE_KEY=your_site_key</code> to your Vercel project environment variables. This is a public key and does not need to be kept secret.</p>
              </div>
            </Section>

            {/* Save button + status */}
            {saveStatus && (
              <div className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 border ${
                saveStatus.ok
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-red-600 bg-red-50 border-red-200'
              }`}>
                {saveStatus.ok
                  ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                  : <AlertCircle className="w-4 h-4 shrink-0" />}
                {saveStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="w-full bg-brand-blue text-white font-semibold py-3 rounded-xl text-sm
                hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5
                transition-all disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {mutation.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving &amp; Applying…</>
                : <><CheckCircle2 className="w-4 h-4" /> Save &amp; Apply All Settings</>
              }
            </button>

            <p className="text-center text-xs text-gray-400">
              Changes are applied instantly to the running server. No restart needed.
            </p>
          </form>
        )}
      </div>
    </>
  )
}
